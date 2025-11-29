# Script para actualizar imports a la nueva estructura modular
# Ejecutar desde la raíz del proyecto

$appPath = "c:\Users\alexi\OneDrive\Escritorio\ondesk-app\src\app"

# Patrones de reemplazo de imports
$replacements = @(
    @("from `"@/components/ui/", "from `"@/ui/"),
    @("from `"@/components/site/", "from `"@/modules/shared/components/"),
    @("from `"@/components/dashboard/", "from `"@/modules/dashboard/components/"),
    @("from `"@/components/providers/", "from `"@/modules/shared/components/providers/"),
    @("from `"@/hooks/", "from `"@/core/hooks/"),
    @("from `"@/lib/validations/", "from `"@/core/validations/"),
    @("from `"@/lib/constants/", "from `"@/core/constants/"),
    @("from `"@/lib/utils`"", "from `"@/core/utils/utils`""),
    @("from `"@/lib/services/", "from `"@/core/services/")
)

# Buscar todos los archivos .tsx, .ts en src/app
$files = Get-ChildItem -Path $appPath -Recurse -Include "*.tsx", "*.ts"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement[0]), $replacement[1]
    }
    
    # Solo escribir si hubo cambios
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Actualizado: $($file.FullName)"
    }
}

Write-Host "Actualización de imports completada!"
