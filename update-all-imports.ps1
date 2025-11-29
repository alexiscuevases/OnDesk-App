# Script para actualizar imports en TODOS los archivos src/

$srcPath = "c:\Users\alexi\OneDrive\Escritorio\ondesk-app\src"

$replacements = @(
    @('from "@/components/ui/', 'from "@/ui/'),
    @('from "@/components/site/', 'from "@/modules/shared/components/'),
    @('from "@/components/dashboard/', 'from "@/modules/dashboard/components/'),
    @('from "@/components/providers/', 'from "@/modules/shared/components/providers/'),
    @('from "@/hooks/', 'from "@/core/hooks/'),
    @('from "@/lib/validations/', 'from "@/core/validations/'),
    @('from "@/lib/constants/', 'from "@/core/constants/'),
    @('from "@/lib/utils"', 'from "@/core/utils/utils"'),
    @('from "@/lib/supabase/', 'from "@/core/supabase/'),
    @('from "@/lib/services/', 'from "@/core/services/'),
    @('from "@/lib/whatsapp"', 'from "@/core/utils/whatsapp"'),
    @('from "@/lib/stripe"', 'from "@/core/utils/stripe"'),
    @('from "@/lib/nodemailer"', 'from "@/core/utils/nodemailer"')
)

$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.tsx", "*.ts"
$updatedCount = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement[0]), $replacement[1]
    }
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Updated: $($file.Name)"
        $updatedCount++
    }
}

Write-Host "Total files updated: $updatedCount"
