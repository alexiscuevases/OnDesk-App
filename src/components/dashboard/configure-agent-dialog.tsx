"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

interface ConfigureAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: {
    id: string
    name: string
    description: string
  }
}

export function ConfigureAgentDialog({ open, onOpenChange, agent }: ConfigureAgentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Agent: {agent.name}</DialogTitle>
          <DialogDescription>Customize your agent's settings and behavior</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Agent Name</Label>
              <Input id="edit-name" defaultValue={agent.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input id="edit-description" defaultValue={agent.description} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Agent Type</Label>
              <Select defaultValue="support">
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="sales">Sales Assistant</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="onboarding">Onboarding Guide</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch id="edit-status" defaultChecked />
                <Label htmlFor="edit-status" className="font-normal">
                  Agent is active
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-prompt">System Prompt</Label>
              <Textarea
                id="edit-prompt"
                placeholder="You are a helpful customer support agent..."
                className="min-h-[200px]"
                defaultValue="You are a helpful customer support agent. Your goal is to assist customers with their inquiries and provide accurate information."
              />
              <p className="text-xs text-muted-foreground">
                This prompt defines your agent's personality, knowledge, and behavior
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-context">Additional Context</Label>
              <Textarea
                id="edit-context"
                placeholder="Add any additional context or knowledge..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Provide specific information about your business, products, or policies
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-model">AI Model</Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger id="edit-model">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-temperature">Temperature: 0.7</Label>
              <input
                type="range"
                id="edit-temperature"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness. Lower values make responses more focused and deterministic
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-max-tokens">Max Response Length</Label>
              <Input id="edit-max-tokens" type="number" defaultValue="500" />
              <p className="text-xs text-muted-foreground">Maximum number of tokens in the response</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch id="edit-memory" defaultChecked />
                <Label htmlFor="edit-memory" className="font-normal">
                  Enable conversation memory
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-fallback" defaultChecked />
                <Label htmlFor="edit-fallback" className="font-normal">
                  Enable human fallback
                </Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
