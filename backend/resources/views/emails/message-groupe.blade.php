<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; color: #1a1a1a;">
    <p>Bonjour {{ $prenom }},</p>

    <div>
        {!! nl2br(e($contenu)) !!}
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #888;">
        Section Thiaroye Yeumbeul 1
    </p>
</body>
</html>