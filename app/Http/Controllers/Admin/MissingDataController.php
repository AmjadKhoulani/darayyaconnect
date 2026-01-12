<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MissingDataController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/MissingData', [
            'items' => [
                [
                    'id' => 1,
                    'title' => 'عدد السكان الحقيقي (العائدين)',
                    'category' => 'demographics',
                    'status' => 'estimate', // unknown, estimate, outdated
                    'confidence' => 60, // Percentage
                    'last_updated' => '2024-01-01',
                    'description' => 'لا يوجد مسح سكاني شامل منذ 2011. الأرقام الحالية تعتمد على بطاقات التموين.',
                    'impact' => 'صعوبة تقدير الاحتياجات الطبية والتعليمية بدقة.',
                ],
                [
                    'id' => 2,
                    'title' => 'عدد الآبار العشوائية العاملة',
                    'category' => 'water',
                    'status' => 'unknown',
                    'confidence' => 10,
                    'last_updated' => null,
                    'description' => 'حفر العديد من الآبار خلال السنوات الماضية دون توثيق رسمي.',
                    'impact' => 'خطر استنزاف المياه الجوفية وتداخل مياه الصرف.',
                ],
                [
                    'id' => 3,
                    'title' => 'مخطط الصرف الصحي (تحت الأرض)',
                    'category' => 'infrastructure',
                    'status' => 'outdated',
                    'confidence' => 40,
                    'last_updated' => '2010-06-15',
                    'description' => 'المخططات الموجودة تعود لما قبل 2011. الكثير من الوصلات تضررت أو تغيرت.',
                    'impact' => 'زيادة تكلفة الحفريات والمفاجآت أثناء الصيانة.',
                ],
                [
                    'id' => 4,
                    'title' => 'عدد الوحدات السكنية غير القابلة للسكن',
                    'category' => 'housing',
                    'status' => 'estimate',
                    'confidence' => 75,
                    'last_updated' => '2023-11-20',
                    'description' => 'مسح بصري خارجي فقط. لم يتم تقييم السلامة الإنشائية من الداخل.',
                    'impact' => 'مخاطر السلامة العامة وتأخر عودة الأهالي.',
                ],
                [
                    'id' => 5,
                    'title' => 'نسبة الفاقد في الشبكة الكهربائية',
                    'category' => 'electricity',
                    'status' => 'outdated',
                    'confidence' => 30,
                    'last_updated' => '2012-01-01',
                    'description' => 'لا توجد عدادات ذكية لقياس الفاقد الفني والتجاري بدقة.',
                    'impact' => 'هدر في الطاقة وصعوبة في تخطيط المولدات البديلة.',
                ]
            ]
        ]);
    }
}
