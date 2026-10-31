Add-Type -AssemblyName System.Drawing
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$names = 1..25 | ForEach-Object { "cover-clean-$_.png" }
$tileW = 360; $tileH = 400; $cols = 5; $rows = [Math]::Ceiling($names.Count / $cols)
$bitmap = [System.Drawing.Bitmap]::new($cols * $tileW, $rows * $tileH)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::White)
$font = [System.Drawing.Font]::new('Arial', 14)
for ($i = 0; $i -lt $names.Count; $i++) {
  $path = Join-Path $base $names[$i]
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $x = ($i % $cols) * $tileW; $y = [Math]::Floor($i / $cols) * $tileH
    $graphics.DrawImage($img, [System.Drawing.Rectangle]::new($x + 5, $y + 5, 350, 350))
    $graphics.DrawString($names[$i], $font, [System.Drawing.Brushes]::Black, [single]($x + 5), [single]($y + 357))
  } finally { $img.Dispose() }
}
$bitmap.Save((Join-Path $base 'cover-clean-contact-sheet.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graphics.Dispose(); $bitmap.Dispose(); $font.Dispose()
