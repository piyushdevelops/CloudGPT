$source = Get-Content -Raw 'homepage-memory-products-oct25/admin/menu-before.json' | ConvertFrom-Json
$menu = $source.menus.nodes | Where-Object { $_.handle -eq 'tjs-redesign-navigation' }
function Convert-MenuItem($item) {
  $out = [ordered]@{}
  if ($item.id) { $out.id = $item.id }
  $out.title = $item.title
  $out.type = $item.type
  if ($item.url) { $out.url = $item.url }
  if ($item.resourceId) { $out.resourceId = $item.resourceId }
  $out.items = @($item.items | ForEach-Object { Convert-MenuItem $_ })
  return $out
}
$items = [System.Collections.Generic.List[object]]::new()
foreach ($item in $menu.items) {
  if ($item.title -match 'Mystery Box') { continue }
  $items.Add((Convert-MenuItem $item))
  if ($item.title -eq 'Planners & Journals') {
    $items.Add([ordered]@{title='Our Days';type='COLLECTION';url='/collections/our-days-memory-books';resourceId='gid://shopify/Collection/643833626819';items=@()})
    $items.Add([ordered]@{title='Photo Books';type='COLLECTION';url='/collections/photo-books';resourceId='gid://shopify/Collection/643832283331';items=@()})
  }
}
$vars = [ordered]@{id=$menu.id;title=$menu.title;handle=$menu.handle;items=$items}
$vars | ConvertTo-Json -Depth 20 | Set-Content -Encoding utf8 'homepage-memory-products-oct25/admin/update-menu.variables.json'
