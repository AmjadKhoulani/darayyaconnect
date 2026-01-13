<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في مجتمع داريا</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); padding: 40px 0;">
                            <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 20px; text-align: center; line-height: 80px; font-size: 40px; color: #ffffff; margin-bottom: 10px;">
                                د
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">مجتمع داريا</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">أهلاً بك، {{ $user->name }}! 👋</h2>
                            <p style="color: #64748b; line-height: 1.6; font-size: 16px;">
                                سعداء جداً بانضمامك إلينا. لقد تم إنشاء حسابك بنجاح.
                            </p>
                            <p style="color: #64748b; line-height: 1.6; font-size: 16px;">
                                مجتمع داريا هو منصتك للتواصل مع مدينتك، معرفة آخر الأخبار، والمساهمة في المبادرات المحلية.
                            </p>
                            
                            <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                                <p style="color: #166534; font-weight: bold; margin: 0 0 10px 0;">خطوتك التالية:</p>
                                <p style="color: #166534; margin: 0; font-size: 14px;">
                                    يرجى إكمال إعدادات موقعك في التطبيق لنتمكن من تزويدك بتحديثات الخدمات (الكهرباء، المياه) الخاصة بحيك.
                                </p>
                            </div>

                            <p style="color: #64748b; margin-bottom: 30px;">
                                نتمنى لك تجربة مفيدة وممتعة!
                            </p>

                            <a href="#" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 12px; font-weight: bold; font-size: 16px;">
                                فتح التطبيق
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 20px; text-align: center;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                © {{ date('Y') }} مجتمع داريا. جميع الحقوق محفوظة.
                            </p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">
                                هذا بريد آلي، يرجى عدم الرد.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
