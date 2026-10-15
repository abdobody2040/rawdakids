Add-Type -AssemblyName System.Drawing

$baseDir = "g:\quran app for kids"
$jsonPath = "$baseDir\scripts\store_assets_data.json"
$cfg = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$outDir = "$baseDir\google-play-media"
$phoneDir = "$outDir\phone_screenshots"
$tabletDir = "$outDir\tablet_screenshots"

[System.IO.Directory]::CreateDirectory($outDir) | Out-Null
[System.IO.Directory]::CreateDirectory($phoneDir) | Out-Null
[System.IO.Directory]::CreateDirectory($tabletDir) | Out-Null

function Save-HighQualityBitmap($bmp, $filePath, $format) {
    if ($format -eq "png") {
        $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    } elseif ($format -eq "jpeg") {
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
        $bmp.Save($filePath, $encoder, $encoderParams)
    }
}

# 1. App Icon 512x512
Write-Host "Creating App Icon 512x512..."
$srcIconPath = "$baseDir\$($cfg.appIcon.source)"
$iconSrc = [System.Drawing.Image]::FromFile($srcIconPath)
$iconBmp = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(6, 78, 59))
$g.DrawImage($iconSrc, 0, 0, 512, 512)
$g.Dispose()
$iconSrc.Dispose()

Save-HighQualityBitmap $iconBmp "$outDir\$($cfg.appIcon.output)" "png"
$iconBmp.Dispose()
Write-Host "App icon saved to $outDir\$($cfg.appIcon.output)"

# 2. Feature Graphic 1024x500
Write-Host "Creating Feature Graphic 1024x500..."
$fg = $cfg.featureGraphic
$fgBmp = New-Object System.Drawing.Bitmap(1024, 500, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($fgBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$bgPath = "$baseDir\$($fg.bg)"
if (Test-Path $bgPath) {
    $bgImg = [System.Drawing.Image]::FromFile($bgPath)
    $g.DrawImage($bgImg, 0, 0, 1024, 500)
    $bgImg.Dispose()
}

$overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(1024, 0)),
    [System.Drawing.Color]::FromArgb(220, 4, 30, 24),
    [System.Drawing.Color]::FromArgb(80, 4, 30, 24)
)
$g.FillRectangle($overlayBrush, 0, 0, 1024, 500)
$overlayBrush.Dispose()

$mascotPath = "$baseDir\$($fg.mascot)"
if (Test-Path $mascotPath) {
    $mascot = [System.Drawing.Image]::FromFile($mascotPath)
    $g.DrawImage($mascot, 660, 40, 320, 420)
    $mascot.Dispose()
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 158, 11), 6)
    $g.DrawRectangle($goldPen, 660, 40, 320, 420)
    $goldPen.Dispose()
}

$fontTitle = New-Object System.Drawing.Font("Segoe UI", 42, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fontBadges = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$fontBullets = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
$greenLightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 231, 183))

$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 16, 185, 129))
$g.FillRectangle($badgeBg, 50, 45, 450, 44)
$badgeBg.Dispose()

$sfRTL = New-Object System.Drawing.StringFormat
$sfRTL.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft

$g.DrawString($fg.badge, $fontBadges, $whiteBrush, (New-Object System.Drawing.RectangleF(50, 50, 440, 36)), $sfRTL)
$g.DrawString($fg.title, $fontTitle, $goldBrush, (New-Object System.Drawing.RectangleF(45, 105, 580, 80)), $sfRTL)
$g.DrawString($fg.subtitle, $fontSub, $whiteBrush, (New-Object System.Drawing.RectangleF(45, 185, 580, 50)), $sfRTL)

$yPos = 245
foreach ($bullet in $fg.bullets) {
    $bulletText = "* $bullet"
    $g.DrawString($bulletText, $fontBullets, $greenLightBrush, (New-Object System.Drawing.RectangleF(45, $yPos, 580, 40)), $sfRTL)
    $yPos += 45
}

$g.Dispose()
Save-HighQualityBitmap $fgBmp "$outDir\$($fg.outputPng)" "png"
Save-HighQualityBitmap $fgBmp "$outDir\$($fg.outputJpg)" "jpeg"
$fgBmp.Dispose()
Write-Host "Feature graphic saved."

# 3. Phone Screenshots (1080x1920)
Write-Host "Creating Phone Screenshots (1080x1920)..."

foreach ($sc in $cfg.phoneScreens) {
    Write-Host "Rendering $($sc.file)..."
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $themeC = [System.Drawing.Color]::FromArgb($sc.themeColor[0], $sc.themeColor[1], $sc.themeColor[2])
    $accentC = [System.Drawing.Color]::FromArgb($sc.accentColor[0], $sc.accentColor[1], $sc.accentColor[2])

    $brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(0, 1920)),
        $themeC,
        [System.Drawing.Color]::FromArgb(15, 23, 42)
    )
    $g.FillRectangle($brushBg, 0, 0, 1080, 1920)
    $brushBg.Dispose()

    $fBadge = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)
    $fTitle = New-Object System.Drawing.Font("Segoe UI", 44, [System.Drawing.FontStyle]::Bold)
    $fSub = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)

    $badgeBrush = New-Object System.Drawing.SolidBrush($accentC)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))

    $pillBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 0, 0, 0))
    $g.FillRectangle($pillBrush, 140, 65, 800, 60)
    $pillBrush.Dispose()

    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft

    $g.DrawString($sc.badge, $fBadge, $badgeBrush, (New-Object System.Drawing.RectangleF(0, 75, 1080, 50)), $sfCenter)
    $g.DrawString($sc.title, $fTitle, $whiteBrush, (New-Object System.Drawing.RectangleF(40, 140, 1000, 120)), $sfCenter)
    $g.DrawString($sc.subtitle, $fSub, $mutedBrush, (New-Object System.Drawing.RectangleF(60, 265, 960, 80)), $sfCenter)

    # Smartphone Mockup Frame
    $phoneX = 90
    $phoneY = 360
    $phoneW = 900
    $phoneH = 1510

    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 0, 0, 0))
    $g.FillRectangle($shadowBrush, ($phoneX + 20), ($phoneY + 25), $phoneW, $phoneH)
    $shadowBrush.Dispose()

    $rimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
    $g.FillRectangle($rimBrush, $phoneX, $phoneY, $phoneW, $phoneH)
    $rimBrush.Dispose()

    $phonePen = New-Object System.Drawing.Pen($accentC, 6)
    $g.DrawRectangle($phonePen, $phoneX, $phoneY, $phoneW, $phoneH)
    $phonePen.Dispose()

    $screenX = $phoneX + 24
    $screenY = $phoneY + 36
    $screenW = $phoneW - 48
    $screenH = $phoneH - 60

    $hPath = "$baseDir\$($sc.heroImg)"
    if (Test-Path $hPath) {
        $hImg = [System.Drawing.Image]::FromFile($hPath)
        $g.DrawImage($hImg, $screenX, $screenY, $screenW, 920)
        $hImg.Dispose()
    }

    $cardY = $screenY + 920
    $cardH = $screenH - 920
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 15, 23, 42))
    $g.FillRectangle($cardBrush, $screenX, $cardY, $screenW, $cardH)
    $cardBrush.Dispose()

    $sPath = "$baseDir\$($sc.subImg)"
    if (Test-Path $sPath) {
        $sImg = [System.Drawing.Image]::FromFile($sPath)
        $g.DrawImage($sImg, ($screenX + 50), ($cardY + 45), 360, 360)
        $sImg.Dispose()

        $sPen = New-Object System.Drawing.Pen($accentC, 4)
        $g.DrawRectangle($sPen, ($screenX + 50), ($cardY + 45), 360, 360)
        $sPen.Dispose()
    }

    $fCard = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
    $fCardSub = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Regular)

    $sfRight = New-Object System.Drawing.StringFormat
    $sfRight.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft

    $fy = $cardY + 60
    foreach ($feat in $cfg.cardFeatures) {
        $g.DrawString($feat, $fCardSub, $whiteBrush, (New-Object System.Drawing.RectangleF(($screenX + 440), $fy, 380, 45)), $sfRight)
        $fy += 55
    }

    $notchBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
    $g.FillRectangle($notchBrush, ($phoneX + ($phoneW / 2) - 80), ($phoneY + 10), 160, 18)
    $notchBrush.Dispose()

    $g.Dispose()

    Save-HighQualityBitmap $bmp "$phoneDir\$($sc.file)" "png"
    $bmp.Dispose()
}

# 4. Tablet Screenshots
Write-Host "Creating Tablet Screenshots..."

# 7-inch tablet (1920x1200)
$t7 = $cfg.tabletScreens[0]
$tab7 = New-Object System.Drawing.Bitmap($t7.width, $t7.height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($tab7)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$tabBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($t7.width, $t7.height)),
    [System.Drawing.Color]::FromArgb(6, 78, 59),
    [System.Drawing.Color]::FromArgb(15, 23, 42)
)
$g.FillRectangle($tabBg, 0, 0, $t7.width, $t7.height)
$tabBg.Dispose()

$imgL = "$baseDir\$($t7.imgLeft)"
if (Test-Path $imgL) {
    $imgObj = [System.Drawing.Image]::FromFile($imgL)
    $g.DrawImage($imgObj, 80, 180, 1050, 880)
    $imgObj.Dispose()
}

$imgR = "$baseDir\$($t7.imgRight)"
if (Test-Path $imgR) {
    $imgObj2 = [System.Drawing.Image]::FromFile($imgR)
    $g.DrawImage($imgObj2, 1180, 180, 660, 880)
    $imgObj2.Dispose()
}

$tabPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 158, 11), 6)
$g.DrawRectangle($tabPen, 80, 180, 1050, 880)
$g.DrawRectangle($tabPen, 1180, 180, 660, 880)
$tabPen.Dispose()

$fTabTitle = New-Object System.Drawing.Font("Segoe UI", 44, [System.Drawing.FontStyle]::Bold)
$fTabSub = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

$sfTabRTL = New-Object System.Drawing.StringFormat
$sfTabRTL.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft

$g.DrawString($t7.title, $fTabTitle, $goldBrush, (New-Object System.Drawing.RectangleF(80, 50, 1760, 60)), $sfTabRTL)
$g.DrawString($t7.subtitle, $fTabSub, $whiteBrush, (New-Object System.Drawing.RectangleF(80, 115, 1760, 50)), $sfTabRTL)

$g.Dispose()
Save-HighQualityBitmap $tab7 "$tabletDir\$($t7.file)" "png"
$tab7.Dispose()

# 10-inch tablet (2048x1536)
$t10 = $cfg.tabletScreens[1]
$tab10 = New-Object System.Drawing.Bitmap($t10.width, $t10.height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($tab10)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$tab10Bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($t10.width, $t10.height)),
    [System.Drawing.Color]::FromArgb(4, 120, 87),
    [System.Drawing.Color]::FromArgb(2, 44, 34)
)
$g.FillRectangle($tab10Bg, 0, 0, $t10.width, $t10.height)
$tab10Bg.Dispose()

$imgMain = "$baseDir\$($t10.imgMain)"
if (Test-Path $imgMain) {
    $imgObj = [System.Drawing.Image]::FromFile($imgMain)
    $g.DrawImage($imgObj, 100, 220, 1150, 1150)
    $imgObj.Dispose()
}

$imgS1 = "$baseDir\$($t10.imgSub1)"
if (Test-Path $imgS1) {
    $imgObj = [System.Drawing.Image]::FromFile($imgS1)
    $g.DrawImage($imgObj, 1300, 220, 648, 550)
    $imgObj.Dispose()
}

$imgS2 = "$baseDir\$($t10.imgSub2)"
if (Test-Path $imgS2) {
    $imgObj = [System.Drawing.Image]::FromFile($imgS2)
    $g.DrawImage($imgObj, 1300, 820, 648, 550)
    $imgObj.Dispose()
}

$tabPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(251, 191, 36), 6)
$g.DrawRectangle($tabPen2, 100, 220, 1150, 1150)
$g.DrawRectangle($tabPen2, 1300, 220, 648, 550)
$g.DrawRectangle($tabPen2, 1300, 820, 648, 550)
$tabPen2.Dispose()

$fTab10Title = New-Object System.Drawing.Font("Segoe UI", 48, [System.Drawing.FontStyle]::Bold)
$fTab10Sub = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)

$g.DrawString($t10.title, $fTab10Title, $goldBrush, (New-Object System.Drawing.RectangleF(100, 60, 1848, 70)), $sfTabRTL)
$g.DrawString($t10.subtitle, $fTab10Sub, $whiteBrush, (New-Object System.Drawing.RectangleF(100, 135, 1848, 60)), $sfTabRTL)

$g.Dispose()
Save-HighQualityBitmap $tab10 "$tabletDir\$($t10.file)" "png"
$tab10.Dispose()

Write-Host "SUCCESS! All Google Play Store media assets have been generated in $outDir"
