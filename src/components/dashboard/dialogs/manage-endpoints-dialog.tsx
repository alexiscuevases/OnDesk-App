"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Play, Code, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEndpoints } from "@/hooks/use-endpoints";
import { type Endpoint, type CreateEndpointInput, createEndpointSchema } from "@/lib/validations/endpoint";
import { toast } from "sonner";

interface ManageEndpointsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agentId: string;
	agentName: string;
}

export function ManageEndpointsDialog({ open, onOpenChange, agentId, agentName }: ManageEndpointsDialogProps) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
	const [testDialogOpen, setTestDialogOpen] = useState(false);
	const [selectedEndpointForTest, setSelectedEndpointForTest] = useState<Endpoint | null>(null);
	const [testParams, setTestParams] = useState<Record<string, string>>({});
	const { endpoints, deleteEndpoint, updateEndpoint, createEndpoint, testEndpoint, isTestingEndpoint } = useEndpoints(agentId);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		watch,
		reset,
	} = useForm<CreateEndpointInput>({
		resolver: zodResolver(createEndpointSchema),
		defaultValues: {
			agent_id: agentId,
			name: "",
			description: "",
			method: "GET",
			url: "",
			headers_schema: {},
			params_schema: {},
			response_schema: {},
			timeout: 10000,
			retry_count: 1,
			is_active: true,
		},
	});

	const handleDelete = async (id: string) => {
		if (confirm("¿Estás seguro de que deseas eliminar este endpoint?")) {
			try {
				await deleteEndpoint(id);
				toast.success("Endpoint eliminado exitosamente");
			} catch (error) {
				toast.error("Error al eliminar el endpoint");
			}
		}
	};

	const handleToggleStatus = async (endpoint: Endpoint) => {
		try {
			await updateEndpoint(endpoint.id, { is_active: !endpoint.is_active });
			toast.success(endpoint.is_active ? "Endpoint desactivado" : "Endpoint activado");
		} catch (error) {
			toast.error("Error al actualizar el endpoint");
		}
	};

	const handleTest = async (endpoint: Endpoint) => {
		const paramsSchema = endpoint.params_schema as Record<string, any>;
		const hasParams = Object.keys(paramsSchema).length > 0;

		if (hasParams) {
			setSelectedEndpointForTest(endpoint);
			setTestParams({});
			setTestDialogOpen(true);
		} else {
			await executeTest(endpoint.id, {});
		}
	};

	const executeTest = async (endpointId: string, params: Record<string, string>) => {
		try {
			const result = await testEndpoint(endpointId, params);
			if (result.success) {
				toast.success("Endpoint ejecutado exitosamente", {
					description: `Duración: ${result.duration}ms`,
				});
			} else {
				toast.error(`Error: ${result.error}`);
			}
		} catch (error: any) {
			toast.error(error.message || "Error al probar el endpoint");
		}
	};

	const onSubmit = async (data: CreateEndpointInput) => {
		try {
			const parsedData = {
				...data,
				headers_schema: data.headers_schema ? (typeof data.headers_schema === "string" ? JSON.parse(data.headers_schema) : data.headers_schema) : {},
				params_schema: data.params_schema ? (typeof data.params_schema === "string" ? JSON.parse(data.params_schema) : data.params_schema) : {},
				response_schema: data.response_schema
					? typeof data.response_schema === "string"
						? JSON.parse(data.response_schema)
						: data.response_schema
					: {},
			};

			await createEndpoint(parsedData);
			toast.success("Endpoint creado exitosamente");
			reset();
			setShowCreateForm(false);
		} catch (error: any) {
			toast.error(error.message || "Error al crear el endpoint");
		}
	};

	const getMethodColor = (method: string) => {
		const colors: Record<string, string> = {
			GET: "bg-blue-500",
			POST: "bg-green-500",
			PUT: "bg-yellow-500",
			PATCH: "bg-orange-500",
			DELETE: "bg-red-500",
		};
		return colors[method] || "bg-gray-500";
	};

	const toggleExpanded = (id: string) => {
		setExpandedEndpoint(expandedEndpoint === id ? null : id);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Endpoints de {agentName}</DialogTitle>
						<DialogDescription>Configura las acciones que puede realizar el agente mediante endpoints personalizados</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								{endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""} configurado
								{endpoints.length !== 1 ? "s" : ""}
							</p>
							<Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)} variant={showCreateForm ? "outline" : "default"}>
								{showCreateForm ? (
									<>Cancelar</>
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" />
										Nuevo Endpoint
									</>
								)}
							</Button>
						</div>

						{showCreateForm && (
							<Card className="border-2 border-primary">
								<CardContent className="pt-6">
									<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="name">Nombre *</Label>
												<Input id="name" placeholder="Ej: Consultar Cliente" {...register("name")} />
												{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
											</div>

											<div className="space-y-2">
												<Label htmlFor="method">Método *</Label>
												<Select value={watch("method")} onValueChange={(value: any) => setValue("method", value)}>
													<SelectTrigger id="method">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="GET">GET</SelectItem>
														<SelectItem value="POST">POST</SelectItem>
														<SelectItem value="PUT">PUT</SelectItem>
														<SelectItem value="PATCH">PATCH</SelectItem>
														<SelectItem value="DELETE">DELETE</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="description">Descripción *</Label>
											<Textarea
												id="description"
												placeholder="Describe qué hace este endpoint (mínimo 10 caracteres)"
												{...register("description")}
											/>
											{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
										</div>

										<div className="space-y-2">
											<Label htmlFor="url">URL *</Label>
											<Input id="url" placeholder="https://api.example.com/resource/{id}" {...register("url")} />
											<p className="text-xs text-muted-foreground">Usa {"{id}"} para parámetros en la URL</p>
											{errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
										</div>

										<div className="space-y-2">
											<Label htmlFor="params_schema">Esquema de Parámetros (JSON)</Label>
											<Textarea
												id="params_schema"
												placeholder='{"id": {"type": "string", "required": true}}'
												className="font-mono text-xs"
												rows={3}
												{...register("params_schema")}
											/>
											<p className="text-xs text-muted-foreground">
												Define los parámetros de URL. Ejemplo: {`{"id": {"type": "string"}}`}
											</p>
										</div>

										<div className="space-y-2">
											<Label htmlFor="headers_schema">Headers Personalizados (JSON)</Label>
											<Textarea
												id="headers_schema"
												placeholder='{"X-Custom-Header": "value"}'
												className="font-mono text-xs"
												rows={2}
												{...register("headers_schema")}
											/>
											<p className="text-xs text-muted-foreground">Headers HTTP adicionales (opcional)</p>
										</div>

										<div className="space-y-2">
											<Label htmlFor="response_schema">Esquema de Respuesta (JSON)</Label>
											<Textarea
												id="response_schema"
												placeholder='{"id": "string", "name": "string", "email": "string"}'
												className="font-mono text-xs"
												rows={3}
												{...register("response_schema")}
											/>
											<p className="text-xs text-muted-foreground">Describe la estructura esperada de la respuesta (opcional)</p>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="timeout">Timeout (ms)</Label>
												<Input id="timeout" type="number" {...register("timeout", { valueAsNumber: true })} />
											</div>

											<div className="space-y-2">
												<Label htmlFor="retry_count">Reintentos</Label>
												<Input id="retry_count" type="number" min="0" max="3" {...register("retry_count", { valueAsNumber: true })} />
											</div>
										</div>

										<div className="flex justify-end gap-2 pt-4 border-t">
											<Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
												Cancelar
											</Button>
											<Button type="submit" disabled={isSubmitting}>
												{isSubmitting ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Creando...
													</>
												) : (
													"Crear Endpoint"
												)}
											</Button>
										</div>
									</form>
								</CardContent>
							</Card>
						)}

						{endpoints.length === 0 && !showCreateForm ? (
							<Card className="border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-12">
									<Code className="h-12 w-12 text-muted-foreground mb-4" />
									<p className="text-center text-muted-foreground mb-2">No hay endpoints configurados</p>
									<p className="text-center text-sm text-muted-foreground mb-4">
										Agrega endpoints para que el agente pueda consultar, crear, actualizar o eliminar recursos
									</p>
									<Button variant="outline" onClick={() => setShowCreateForm(true)}>
										<Plus className="h-4 w-4 mr-2" />
										Crear Primer Endpoint
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-3">
								{endpoints.map((endpoint) => (
									<Card key={endpoint.id} className={expandedEndpoint === endpoint.id ? "border-primary" : ""}>
										<CardContent className="p-4">
											<div className="flex items-start justify-between">
												<div className="space-y-2 flex-1">
													<div className="flex items-center gap-2">
														<Badge className={`${getMethodColor(endpoint.method)} text-white text-xs font-mono`}>
															{endpoint.method}
														</Badge>
														<h4 className="font-medium">{endpoint.name}</h4>
														<Badge variant={endpoint.is_active ? "default" : "outline"} className="text-xs">
															{endpoint.is_active ? "Activo" : "Inactivo"}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground">{endpoint.description}</p>
													<p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">{endpoint.url}</p>

													{expandedEndpoint === endpoint.id && (
														<div className="mt-4 pt-4 border-t space-y-3">
															<div className="grid grid-cols-2 gap-4 text-sm">
																<div>
																	<Label className="text-xs text-muted-foreground">Timeout</Label>
																	<p className="font-mono">{endpoint.timeout}ms</p>
																</div>
																<div>
																	<Label className="text-xs text-muted-foreground">Reintentos</Label>
																	<p className="font-mono">{endpoint.retry_count}</p>
																</div>
																<div>
																	<Label className="text-xs text-muted-foreground">Autenticación</Label>
																	<p className="font-mono">{endpoint.auth_type}</p>
																</div>
																<div>
																	<Label className="text-xs text-muted-foreground">Parámetros</Label>
																	<p className="font-mono">{Object.keys(endpoint.params_schema).length}</p>
																</div>
															</div>

															{Object.keys(endpoint.params_schema).length > 0 && (
																<div>
																	<Label className="text-xs text-muted-foreground">Esquema de Parámetros</Label>
																	<pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
																		{JSON.stringify(endpoint.params_schema, null, 2)}
																	</pre>
																</div>
															)}
														</div>
													)}
												</div>

												<div className="flex items-center gap-2 ml-4">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => toggleExpanded(endpoint.id)}
														title={expandedEndpoint === endpoint.id ? "Contraer" : "Expandir"}>
														{expandedEndpoint === endpoint.id ? (
															<ChevronUp className="h-4 w-4" />
														) : (
															<ChevronDown className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleTest(endpoint)}
														disabled={isTestingEndpoint}
														title="Probar endpoint">
														{isTestingEndpoint ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
													</Button>
													<Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(endpoint.id)}>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>

											<div className="mt-4 pt-4 border-t border-border">
												<div className="flex items-center justify-between">
													<Label htmlFor={`status-${endpoint.id}`} className="text-sm">
														{endpoint.is_active ? "Activo" : "Inactivo"}
													</Label>
													<Switch
														id={`status-${endpoint.id}`}
														checked={endpoint.is_active}
														onCheckedChange={() => handleToggleStatus(endpoint)}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cerrar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Probar Endpoint: {selectedEndpointForTest?.name}</DialogTitle>
						<DialogDescription>Ingresa los parámetros requeridos para probar el endpoint</DialogDescription>
					</DialogHeader>

					{selectedEndpointForTest && (
						<div className="space-y-4 py-4">
							{Object.entries(selectedEndpointForTest.params_schema as Record<string, any>).map(([key, schema]) => (
								<div key={key} className="space-y-2">
									<Label htmlFor={`param-${key}`}>
										{key}
										{schema.required && <span className="text-destructive ml-1">*</span>}
									</Label>
									<Input
										id={`param-${key}`}
										type={schema.type === "number" ? "number" : "text"}
										placeholder={`Ingresa ${key}`}
										value={testParams[key] || ""}
										onChange={(e) => setTestParams({ ...testParams, [key]: e.target.value })}
									/>
									{schema.description && <p className="text-xs text-muted-foreground">{schema.description}</p>}
								</div>
							))}
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setTestDialogOpen(false)}>
							Cancelar
						</Button>
						<Button
							onClick={() => {
								if (selectedEndpointForTest) {
									executeTest(selectedEndpointForTest.id, testParams);
									setTestDialogOpen(false);
								}
							}}
							disabled={isTestingEndpoint}>
							{isTestingEndpoint ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Probando...
								</>
							) : (
								"Probar"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
