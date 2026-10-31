Add-Type -AssemblyName System.Drawing
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$names = @('1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','11 oct.jpg','12.jpg','13.jpg','div 1.jpg','div 2.jpg','div 3.jpg','div 4.jpg','div 5.jpg','div 6.jpg','div 7.jpg','div 8.jpg','div 9.jpg','div 10.jpg','div 11.jpg','div 12.jpg','last page.jpg')
$tileW = 250; $tileH = 278; $cols = 5; $rows = [Math]::Ceiling($names.Count / $cols)
$bitmap = [System.Drawing.Bitmap]::new($cols * $tileW, $rows * $tileH)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::White)
$font = [System.Drawing.Font]::new('Arial', 12)
$brush = [System.Drawing.Brushes]::Black
for ($i = 0; $i -lt $names.Count; $i++) {
  $path = Join-Path $base $names[$i]
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $x = ($i % $cols) * $tileW; $y = [Math]::Floor($i / $cols) * $tileH
    $graphics.DrawImage($img, [System.Drawing.Rectangle]::new($x + 5, $y + 5, 240, 240))
    $graphics.DrawString($names[$i], $font, $brush, [single]($x + 5), [single]($y + 248))
  } finally { $img.Dispose() }
}
$bitmap.Save((Join-Path $base 'inside-contact-sheet.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graphics.Dispose(); $bitmap.Dispose(); $font.Dispose()
