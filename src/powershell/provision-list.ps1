param(
    [Parameter(Mandatory=$true)]
    [string]$webUrl = 'https://sharepoint.contoso.local/sites/workshop'
)

# Aufruf: provision-list.ps1 -webUrl "http://sharepoint.pangaea.local/sites/lzpd/jgotthardt"

# $user = "jgotthardt@pangaea.local"
# $credentials = Get-Credential -Message "Anmelden an $($siteUrl)" -UserName $user
# Verwendet SharePointPnPPowershell2019
cd D:\source\Workshop\EditListItem\src\powershell

# Connect to SharePoint site
# Connect-PnPOnline -Url $webUrl -Credentials $credentials
Connect-PnPOnline -Url $webUrl -CurrentCredentials

try {
    # Create the list
    $listName = "Planung"
    
    # Check if list already exists
    $existingList = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
    if ($null -eq $existingList) {
        [void](New-PnPList -Title $listName -Template GenericList)
        Write-Host "Created list: $listName" -ForegroundColor Green
    } else {
        Write-Host "List '$listName' already exists, skipping creation" -ForegroundColor Yellow
    }
    
    # Rename the title column of the list to 'Thema'
    Set-PnPField -List $listName -Identity "Title" -Values @{Title="Thema"}

    # Enable the list to appear in Quick Launch navigation and disable attachments
    $list = Get-PnPList -Identity $listName

    $list.OnQuickLaunch = $true
    $list.EnableAttachments = $false
    $list.Update()
    Invoke-PnPQuery
    Write-Host "Enabled list in Quick Launch navigation" -ForegroundColor Green
    Write-Host "Disabled attachments for the list" -ForegroundColor Green
    
    # Define fields to add
    $fieldsToAdd = @(
        @{DisplayName="Leiter"; InternalName="Leiter"; Type="User"; SelectionMode="PeopleOnly"},
        @{DisplayName="Beginn"; InternalName="Beginn"; Type="DateTime"},
        @{DisplayName="Ende"; InternalName="Ende"; Type="DateTime"},
        @{DisplayName="Verpflegung"; InternalName="Verpflegung"; Type="Boolean"},
        @{DisplayName="Anzahl Essen"; InternalName="AnzahlEssen"; Type="Number"}
    )
    
    # Add fields if they don't exist
    foreach ($field in $fieldsToAdd) {
        $existingField = Get-PnPField -List $listName -Identity $field.InternalName -ErrorAction SilentlyContinue
        if ($null -eq $existingField) {
            if ($field.Type -eq "User") {
                # Add User field with SelectionMode parameter if supported
                if ($field.SelectionMode) {
                    # Try to add the field with XML schema to set SelectionMode
                    $fieldXml = "<Field Type='User' DisplayName='$($field.DisplayName)' Name='$($field.InternalName)' UserSelectionMode='$($field.SelectionMode)' />"
                    [void](Add-PnPFieldFromXml -List $listName -FieldXml $fieldXml)
                } else {
                    [void](Add-PnPField -List $listName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type $field.Type)
                }
            } else {
                [void](Add-PnPField -List $listName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type $field.Type)
            }
            Write-Host "Added field: $($field.DisplayName)" -ForegroundColor Green
        } else {
            Write-Host "Field '$($field.DisplayName)' already exists, skipping" -ForegroundColor Yellow
        }
    }
    
    Write-Host "Custom fields processing completed" -ForegroundColor Green
        
    # Update default view to include new fields
    $defaultView = Get-PnPView -List $listName | Where-Object { $_.DefaultView -eq $true }
    [void](Set-PnPView -List $listName -Identity $defaultView.Id -Fields @("Title", "Leiter", "Beginn", "Ende", "Verpflegung", "AnzahlEssen"))
    
    Write-Host "Updated default view" -ForegroundColor Green
    Write-Host "List provisioning completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "Error provisioning list: $($_.Exception.Message)"
}
finally {
    Disconnect-PnPOnline
}