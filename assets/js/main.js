/* main.js - Salah Tech Group (STG)
   Developer: Eng. Baqer Hayder
   Features:
   - Tech Background Canvas Particle Network
   - Mobile Navigation & Smooth Scrolling
   - Software Category Filters
   - Lightbox Modal with Slides Gallery
   - Arabic / English Bilingual System
   - Direct WhatsApp / Email Inquiry Dispatcher
*/

document.addEventListener('DOMContentLoaded', () => {
    initTechCanvas();
    initNavigation();
    initCategoryFilters();
    initSimulatorTabs();
    initLightbox();
    initBilingualSystem();
    initContactForm();
});

/* ==========================================================================
   1. TECH CANVAS PARTICLES BACKGROUND
   ========================================================================== */
function initTechCanvas() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 35 : 75;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 1.8 + 0.8;
            this.color = Math.random() > 0.4 ? 'rgba(0, 173, 181, ' : 'rgba(212, 175, 55, ';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.7)';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (1 - dist / 130) * 0.18;
                    ctx.strokeStyle = `rgba(0, 173, 181, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. NAVIGATION & SCROLL EVENTS
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   3. CATEGORY FILTERS FOR SOFTWARE
   ========================================================================== */
function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    const cards = document.querySelectorAll('.software-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter || (filter === 'oil' && (category === 'oil' || category === 'pressure'))) {
                    card.style.display = 'grid';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   4. SIMULATOR TABS SWITCHER
   ========================================================================== */
function initSimulatorTabs() {
    const tabBtns = document.querySelectorAll('.sim-nav-btn');
    const tabPanes = document.querySelectorAll('.sim-content-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. LIGHTBOX MODAL WITH GALLERY
   ========================================================================== */
let currentLightboxIndex = 0;
let galleryItems = [];

function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalTitle = document.getElementById('lightboxTitle');
    const modalCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.btn-close-lightbox');
    const prevBtn = document.getElementById('btnLightboxPrev');
    const nextBtn = document.getElementById('btnLightboxNext');

    // Collect all zoomable triggers
    const triggers = document.querySelectorAll('[data-lightbox-src]');
    galleryItems = Array.from(triggers).map(t => ({
        src: t.getAttribute('data-lightbox-src'),
        title: t.getAttribute('data-lightbox-title') || '',
        desc: t.getAttribute('data-lightbox-desc') || ''
    }));

    triggers.forEach((el, index) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        const item = galleryItems[index];
        if (!item) return;

        modalImg.src = item.src;
        modalTitle.textContent = item.title;
        modalCaption.textContent = item.desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeLightbox();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentLightboxIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
            openLightbox(currentLightboxIndex);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentLightboxIndex);
        }
        if (e.key === 'ArrowRight') {
            currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
            openLightbox(currentLightboxIndex);
        }
    });
}

/* ==========================================================================
   6. BILINGUAL TRANSLATION SYSTEM (AR / EN)
   ========================================================================== */
const translations = {
    ar: {
        "formPlaceholderName": "أدخل اسمك أو اسم الشركة",
        "formPlaceholderNotes": "اكتب نبذة عن احتياجاتك أو عدد التراخيص والمواقع المطلوبة...",
        "navInstagramTitle": "حساب انستغرام الرسمي @stg.iq",
        "engTooltipCall": "اتصال",
        "engTooltipIg": "متابعة على انستغرام",
        "engTooltipEmail": "مراسلة إلكترونية",
        "brandTitle": "مجموعة صلاح التقنية",
        "brandSubtitle": "الحلول التقنية المتكاملة - STG",
        "navHome": "الرئيسية",
        "navSolutions": "البرامج والحلول",
        "navSimulator": "المحاكي الحي",
        "navFeatures": "الميزات الهندسية",
        "navPartners": "شركاؤنا في النجاح",
        "navAbout": "عن المجموعة",
        "navContact": "اتصل بنا",
        "btnCallNav": "اتصال مباشر",
        "heroBadge": "ريادة الحلول البرمجية والأنظمة الصناعية والمالية",
        "heroTitle": "تقنيات رقمية فائقة الدقة للقطاعات <span class=\"gradient-text\">النفطية</span> والصناعية والتجارية",
        "heroSubtitle": "مجموعة صلاح التقنية برئاسة المهندس باقر حيدر تقدم حزمة رائدة من البرمجيات المتخصصة: أنظمة مراقبة منصات حفر آبار النفط، أتمتة ومعايرة أجهزة الـ PLC، أنظمة جباية الإيرادات الحكومية، ونظم إدارة نقاط البيع والأقساط المتطورة.",
        "btnExplore": "استعراض البرامج الجاهزة",
        "btnHeroWhatsapp": "مراسلة واتساب فورية",
        "btnRequestQuote": "طلب استشارة أو عرض سعر",
        "engTitle": "المهندس باقر حيدر",
        "engRole": "مؤسس وكبير مهندسي النظم والمطور",
        "engCompany": "Salah Tech Group - Technology Solutions",
        "engBtnConsultation": "طلب موعد استشارة وتجربة نظام",
        "statsSolutions": "أنظمة برمجية جاهزة متخصصة",
        "statsReliability": "موثوقية وتشفير حكومي محكم",
        "statsIndustrial": "أتمتة صناعية و Modbus/TCP",
        "statsSupport": "دعم فني واستشاري ميداني",
        "softwareTag": "الأنظمة والحلول الجاهزة",
        "softwareTitle": "برمجيات متقدمة صُممت لتقود أعمالك نحو القمة",
        "softwareDesc": "تستعرض مجموعة صلاح التقنية برامجها الجاهزة والمطورة بأحدث المعايير البرمجية لتلبي متطلبات قطاع النفط، المصانع، المؤسسات الحكومية، ومتاجر التجزئة.",
        "filterAll": "جميع الأنظمة",
        "filterOil": "القطاع النفطي والصناعي",
        "filterPLC": "الأتمتة وقراءة الـ PLC",
        "filterGov": "الأنظمة المالية والحكومية",
        "filterERP": "المتاجر والأقساط POS",
        "sys1PreviewOverlay": "معاينة واجهات النظام (16+ شاشة تفاعلية)",
        "sys1Tag": "القطاع النفطي وحفر الآبار",
        "sys1Title": "1. حزمة اليمان لمراقبة منصات الحفر (Rig Monitor System)",
        "sys1Desc": "منظومة برمجية هندسية متكاملة تتكون من <strong>3 برامج متخصصة</strong> تعمل في بيئات منصات حفر آبار النفط، توفر مراقبة حية ولحظية لمعاملات الحفر الحساسة لضمان أعلى مستويات الأمان وسرعة اتخاذ القرار الميداني.",
        "sys1SuiteTitle": "الحزمة تشمل 3 برامج متخصصة ومترابطة:",
        "sys1Pill1": "1. Rig Monitor System (شاشة القيادة الميدانية)",
        "sys1Pill2": "2. Rig Server (خادم ربط وتدفق البيانات الضخمة)",
        "sys1Pill3": "3. Online Watch (المراقبة السحابية الحية عن بُعد)",
        "sys1F1": "<strong>مراقبة فورية (Real-Time):</strong> قراءة ضغط المضخات (SPP)، عزم الدوران (TRQ)، سرعة الدوران (RPM)، وحمل الخطاف.",
        "sys1F2": "<strong>إنذار مبكر للغازات الخطرة:</strong> مؤشرات حية لغاز H2S والغازات القابلة للاشتعال وحالة 10 خزانات طين.",
        "sys1F3": "<strong>تكامل الذكاء الاصطناعي (AI Co-Pilot):</strong> دعم هندسي لاتخاذ القرارات السليمة أثناء الحفر وتفادي الحوادث.",
        "sys1F4": "<strong>تتبع جغرافي ومراقبة عبر الويب:</strong> متابعة مستمرة لمنصات الحفر على الخريطة من غرفة العمليات الرئيسية.",
        "sys1BtnPresentation": "عرض العرض التقديمي الشامل للنظام",
        "sys1BtnServer": "معاينة Rig Server",
        "sys1BtnWatch": "معاينة Online Watch",
        "sys2Tag": "المتاجر ونقاط البيع والأقساط",
        "sys2Title": "2. نظام الميان المتكامل (Al-Mayan ERP & POS)",
        "sys2Desc": "حل رقمي شامل لإدارة المتاجر العامة ومحلات البيع بالأقساط والمخازن. مزود بحزمة ضخمة من المعادلات الحسابية الدقيقة، كشوفات السيولة النقدية، وإدارة شاملة للموردين والزبائن.",
        "sys2F1": "<strong>نقاط بيع ذكية (POS):</strong> دعم الفواتير المتعددة، الباركود، الطابعات الحرارية، وشاشات الزبون الإضافية.",
        "sys2F2": "<strong>نظام أقساط حسابي متقدم:</strong> احتساب الفوائد، جدولة مواعيد السداد الشهرية، وتنبيهات فورية للأقساط المتأخرة.",
        "sys2F3": "<strong>خدمة البيع المباشر عبر الهاتف (Direct Sale):</strong> ربط سلة الزبون النشط مباشرة عبر رابط محلي وتأكيد الفاتورة.",
        "sys2F4": "<strong>لوحة تحكم إدارية وافية:</strong> إحصائيات السيولة النقدية المتوفرة، المبيعات اليومية، والمصاريف الخارجية وإنهاء الجلسات.",
        "sys2BtnControl": "معاينة لوحة التحكم (Mian-Main Control)",
        "sys2BtnDirect": "معاينة البيع المباشر (Mian)",
        "sys2BtnCalc": "حاسبة الأقساط",
        "sys2PreviewOverlay": "معاينة شاشات الميان (لوحة التحكم والبيع المباشر)",
        "sys3PreviewOverlay": "معاينة نظام جباية الإيرادات الحكومية",
        "sys3Tag": "القطاع الحكومي والمؤسسات الرسمية",
        "sys3Title": "3. برنامج إيرادات (نظام جباية الإيرادات الحكومية)",
        "sys3Desc": "نظام مالي وأمني مؤتمت مخصص لدوائر الدولة والوزارات (مثل وزارة الداخلية - دائرة الجنسية والإقامة والدوائر الخدمية) لأتمتة عمليات قبض الرسوم وجباية الإيرادات بسلاسة ودون أخطاء بشرية.",
        "sys3F1": "<strong>عمليات قبض فورية وآمنة:</strong> إصدار الوصولات وتأكيد المقبوضات بلمسة واحدة لإنهاء الطوابير.",
        "sys3F2": "<strong>دعم الدفع الإلكتروني (POS):</strong> تكامل كامل مع بوابات الدفع الإلكتروني المصرفية ونقاط البيع والنقد.",
        "sys3F3": "<strong>حماية وتشفير عالي:</strong> منظومة صلاحيات دقيقة للموظفين ومدراء النظام لمنع أي تلاعب مالي.",
        "sys3F4": "<strong>كشوفات وجداول زمنية تفصيلية:</strong> جرد فوري للإيرادات حسب المناوبات، الأيام، وتصنيفات المعاملات (إصدار هوية، بطاقة موحدة، بدلات فاقد وتالف).",
        "sys3BtnPreview": "معاينة واجهة الدوائر الحكومية",
        "sys3BtnRequest": "طلب تقديم النظام للجهات الرسمية",
        "sys4Tag": "الأتمتة الصناعية وهندسة التحكم",
        "sys4Title": "4. برنامج الرزان (Al-Razan PLC & Calibration Suite)",
        "sys4Desc": "بيئة برمجية رائدة لقراءة سجلات أجهزة الـ PLC الصناعية وإجراء المعايرة الدقيقة. يتيح لأي مبرمج أو مطور بناء واجهات خاصة به والاتصال بالبرنامج عبر الشبكة المحلية للاستفادة الكاملة من القراءات الميدانية.",
        "sys4F1": "<strong>قراءة متزامنة لـ 50+ قناة:</strong> دعم سجلات الـ Holding Address (50 قناة)، Coil Address (50 قناة)، و Numeric Entry.",
        "sys4F2": "<strong>معايرة فائقة الدقة:</strong> معادلات رياضية وهندسية متطورة لتصحيح ومعايرة إشارات الحساسات المختلفة.",
        "sys4F3": "<strong>تكامل مفتوح للمطورين (API Docs):</strong> توثيق شامل وطرق اتصال مشروحة عبر LAN API Port 8080 و Modbus/TCP.",
        "sys4F4": "<strong>مسح واكتشاف الأجهزة (Discovery Scan):</strong> فحص تلقائي وسريع للشبكة لاكتشاف وحدات الـ PLC المتصلة.",
        "sys4BtnPreview": "معاينة واجهة برنامج الرزان",
        "sys4BtnSim": "محاكاة قنوات الـ PLC الحية",
        "sys4PreviewOverlay": "معاينة بطاقة وقنوات الرزان",
        "sys5PreviewOverlay": "معاينة واجهة اختبار الضغط والتقرير",
        "sys5Tag": "القطاع النفطي والفحص الهندسي",
        "sys5Title": "5. برنامج اختبار الضغط (Pressure Test Report)",
        "sys5Desc": "برنامج هندسي متخصص في فحص واختبار ضغوط المضخات ومعدات الآبار (BOP Double Ram, Casing, Valves)، يقدم قراءة حية ومباشرة مع رسم بياني لحظي وتوليد تقارير رسمية جاهزة للطباعة وحفظ PDF.",
        "sys5F1": "<strong>رسم بياني حي (Live Chart):</strong> متابعة مسار الضغط بالـ PSI ثانية بثانية لكشف أي هبوط أو تسريب هيدروليكي فوراً.",
        "sys5F2": "<strong>تقارير هندسية معتمدة:</strong> توليد تقرير فحص كامل بضغطة زر يتضمن بيانات المعدة، المشغل، والضغوط المقاسة.",
        "sys5F3": "<strong>حفظ مباشر بصيغة PDF والطباعة:</strong> أرشفة رقمية سريعة وطباعة فورية لمهندسي الفحص الميداني.",
        "sys5F4": "<strong>دقة هيدروستاتيكية عالية:</strong> دعم اختبارات الضغط العالي (5000 PSI, 10000 PSI) وتوثيق مدة الاستقرار.",
        "sys5BtnSim": "تشغيل محاكي فحص الضغط الحي",
        "sys5BtnSample": "معاينة نموذج التقرير",
        "simTag": "تجربة تفاعلية مباشرة",
        "simTitle": "مختبر المحاكاة البرمجية الحية",
        "simDesc": "اختبر بنفسك الدقة البرمجية والتحكم اللحظي لأنظمة مجموعة صلاح التقنية من خلال هذه المحاكيات التفاعلية.",
        "simTabPressure": "محاكي اختبار الضغط (Pressure Test)",
        "simTabPLC": "محاكي قنوات الرزان (PLC Monitor)",
        "simTabMayan": "حاسبة أقساط ونقاط بيع الميان",
        "simReadoutPsi": "الضغط المقاس اللحظي (PSI)",
        "simReadoutDuration": "المدة الزمنية للاختبار",
        "simReadoutStatus": "حالة الفحص الهيدروستاتيكي",
        "simCtrlTitle": "لوحة تحكم الفحص",
        "simLabelTestedTool": "المعدة المفحوصة",
        "simLabelTargetPsi": "ضغط الاختبار المستهدف (Test Pressure)",
        "simBtnStart": "بدء الفحص (Start)",
        "simBtnStop": "إيقاف (Stop)",
        "simBtnReset": "إعادة ضبط",
        "simNotePressure": "* يقوم البرنامج الحقيقي بتسجيل هذه البيانات في ملف PDF رسمي يحمل شعار وتوقيع المهندس الفاحص.",
        "simPlcChannelsTitle": "قنوات سجلات الـ PLC (Holding Address 50 Channels)",
        "simPlcCalibTitle": "معايرة حية لقيمة حساسة (Calibration Calculation)",
        "simPlcNetTitle": "إعدادات الاتصال بالشبكة",
        "simPlcLabelIp": "بروتوكول وعنوان الـ PLC IP",
        "simPlcLabelPort": "بوابة واجهة برمجة التطبيقات (LAN API Port)",
        "simPlcLabelStatus": "حالة الاتصال",
        "simBtnPlcConnect": "اتصال بالـ PLC (Connect)",
        "simMayanInputTitle": "مدخلات فاتورة الأقساط",
        "simMayanLabelTotal": "المبلغ الإجمالي للبضاعة (دينار عراقي)",
        "simMayanLabelDown": "المقدمة / الدفعة النقدية الأولى (دينار عراقي)",
        "simMayanLabelMonths": "مدة التقسيط (أشهر)",
        "simMayanLabelProfit": "نسبة الربح السنوية (%)",
        "simMayanBtnCalc": "احتساب جدول الأقساط والأرباح",
        "simMayanOutputTitle": "المخرجات الحسابية لنظام الميان",
        "simMayanOutRemaining": "المبلغ المتبقي بعد المقدمة",
        "simMayanOutProfit": "إجمالي الأرباح المضافة",
        "simMayanOutTotal": "المجموع الكلي مع الأرباح",
        "simMayanOutMonthly": "القسط الشهري المستحق",
        "whyTag": "المعايير الهندسية",
        "whyTitle": "لماذا تعتمد المؤسسات على مجموعة صلاح التقنية؟",
        "whyDesc": "نجمع بين عمق الخبرة الهندسية في الأجهزة الميدانية والقدرات البرمجية المتقدمة لتقديم أنظمة حقيقية تلبي متطلبات الأعمال الأكثر تعقيداً.",
        "feat1Title": "أمان وتشفير بمستوى حكومي",
        "feat1Desc": "صُممت أنظمتنا بأعلى معايير الحماية الرقمية والتدقيق المالي وإدارة الصلاحيات لحماية بيانات المؤسسات من أي اختراق أو عبث.",
        "feat2Title": "سرعة واستجابة في الوقت الفعلي",
        "feat2Desc": "معالجة فورية لقراءات الحساسات، تدفق بيانات الحفارات والـ PLC، وإصدار الوصولات بلمح البصر دون أي بطء أو تأخير.",
        "feat3Title": "واجهات برمجية مفتوحة (APIs)",
        "feat3Desc": "إمكانية ربط برامجنا مع أي أنظمة أخرى أو واجهات خارجية عبر LAN APIs و Modbus TCP مع توثيق برمجي كامل للمطورين.",
        "feat4Title": "تحمل البيئات الميدانية القاسية",
        "feat4Desc": "تم اختبار واعتماد برامجنا للعمل على منصات حفر آبار النفط وفي المصانع والمواقع النائية مع استقرار دائم 100%.",
        "feat5Title": "تقارير PDF وكشوفات معتمدة",
        "feat5Desc": "توليد تقارير هندسية ومالية فورية جاهزة للطباعة والأرشفة، تدعم الرسوم البيانية والجداول التفصيلية الدقيقة.",
        "feat6Title": "إشراف هندسي ودعم مباشر",
        "feat6Desc": "متابعة وتحديث مستمر بإشراف المهندس باقر حيدر لضمان تلبية كافة احتياجات العميل وتدريب فرق العمل.",
        "partnersTag": "شركاؤنا في النجاح",
        "partnersTitle": "شركاء النجاح والثقة المتبادلة",
        "partnersDesc": "نعتز بثقة نخبة من كبرى الشركات والمؤسسات والمحلات التجارية التي اعتمدت على أنظمتنا البرمجية وحلولنا الرقمية لتحقيق الريادة والكفاءة العالية في أعمالها.",
        "partner1Name": "شركة مخابز كربلاء (KBC)",
        "partner1Cat": "الصناعات الغذائية والمخابز الآلية",
        "partner1Address": "كربلاء حولي سيد جودة - عامود 13550",
        "partner2Name": "محلات أبو تراب للأجهزة المنزلية",
        "partner2Cat": "الأجهزة الكهربائية ونظام التقسيط (POS)",
        "partner2Address": "كربلاء - الجمعية",
        "partner3Name": "شركة العجلان للنقل والخدمات النفطية",
        "partner3Cat": "الخدمات النفطية والنقل العام - أبراج العجلان",
        "partner3Address": "بغداد - الكرادة - شارع الصناعة - محلة 906-46",
        "partner4Name": "مكتب فلاش لأكسسوارات الهواتف",
        "partner4Cat": "إلكترونيات وملحقات الهواتف المحمولة",
        "partner4Address": "كربلاء - الجمعية",
        "aboutTag": "عن المجموعة",
        "aboutTitle": "مجموعة صلاح التقنية (STG)",
        "aboutLead": "كيان تقني وهندسي متخصص في تطوير البرمجيات المعقدة والحلول الرقمية الذكية، يجمع بين علوم البرمجة الحديثة وهندسة الأتمتة الصناعية والنفطية.",
        "aboutBody": "بقيادة <strong>المهندس باقر حيدر</strong>، نجحت المجموعة في ابتكار برمجيات حيوية تعمل في الميدان النفطي (منصات حفر الآبار وفحوصات الضغط)، الأتمتة الصناعية (قراءة ومعايرة أجهزة الـ PLC)، المؤسسات الحكومية (أنظمة جباية الإيرادات)، والقطاع التجاري (أنظمة المتاجر والأقساط).",
        "aboutFounderLabel": "المؤسس والمطور",
        "aboutFounderValue": "المهندس باقر حيدر",
        "aboutSpecLabel": "مجال التخصص",
        "aboutSpecValue": "تكنولوجيا المعلومات والحلول الرقمية",
        "aboutAiLabel": "تقنيات الذكاء الاصطناعي",
        "aboutAiValue": "استخدام وتطوير الذكاء الاصطناعي في البرامج والأنظمة",
        "contactTag": "تواصل مباشر",
        "contactTitle": "جاهزون لنقل أعمالك إلى العصر الرقمي",
        "contactDesc": "تواصل مباشرة مع المهندس باقر حيدر للحصول على استشارة فنية، طلب نسخة تجريبية، أو تجهيز عرض سعر خاص بمؤسستك.",
        "contactDirectTitle": "قنوات التواصل المباشر",
        "contactDirectDesc": "يسعدنا الرد على استفساراتكم ومناقشة تفاصيل الأنظمة في أي وقت:",
        "contactPhone1Label": "الخط الرئيسي والمهندس باقر حيدر",
        "btnCall": "اتصال",
        "btnWhatsapp": "واتساب",
        "contactPhone2Label": "الخط الإضافي",
        "contactIgLabel": "الحساب الرسمي على انستغرام",
        "btnFollowIg": "متابعة وتواصل",
        "contactEmailsTitle": "عناوين البريد الإلكتروني الرسمية:",
        "formTitle": "أرسل استفسارك أو اطلب عرض سعر",
        "formDesc": "قم بملء النموذج التالي وسيتم تحويل رسالتك مباشرة إلى واتساب المهندس باقر حيدر للرد السريع:",
        "formLabelName": "الاسم الكريم أو اسم المؤسسة *",
        "formLabelPhone": "رقم الهاتف أو الواتساب *",
        "formLabelSystem": "البرنامج أو الحل المطلوب *",
        "optSys1": "1. نظام اليمان لمراقبة منصات حفر آبار النفط (Rig Monitor System Suite)",
        "optSys2": "2. نظام الميان المتكامل (POS ومحلات الأقساط والمخازن)",
        "optSys3": "3. برنامج إيرادات (نظام جباية الإيرادات الحكومية)",
        "optSys4": "4. برنامج الرزان (PLC & Calibration Suite)",
        "optSys5": "5. برنامج اختبار الضغط (Pressure Test Report)",
        "optSys6": "استشارة عامة أو تصميم نظام خاص مخصص",
        "formLabelNotes": "تفاصيل الاستفسار أو متطلبات العمل",
        "btnSendMsg": "إرسال الاستفسار عبر واتساب",
        "footerDesc": "ريادة الحلول الرقمية وهندسة النظم الذكية في مجالات النفط والغاز، الأتمتة الصناعية، المؤسسات الحكومية، والحلول المصرفية ونقاط البيع.",
        "footerColSystems": "البرامج الجاهزة",
        "footerSys1": "حزمة اليمان لحفر الآبار (RMS)",
        "footerSys2": "نظام الميان المتكامل (POS & ERP)",
        "footerSys3": "برنامج إيرادات الحكومي",
        "footerSys4": "برنامج الرزان لأجهزة الـ PLC",
        "footerSys5": "برنامج اختبار الضغط (Pressure Test)",
        "footerColLinks": "روابط سريعة",
        "footerLinkHome": "الرئيسية",
        "footerLinkSim": "المحاكي البرمجي الحي",
        "footerLinkFeat": "الميزات الهندسية والأمان",
        "footerLinkAbout": "عن المهندس باقر حيدر",
        "footerLinkSlides": "عرض منصات الحفر (Rig Slides)",
        "footerColContact": "المطور والاتصال",
        "footerEngName": "المهندس باقر حيدر",
        "footerIg": "انستغرام: @stg.iq",
        "footerCopy": "&copy; 2026 مجموعة صلاح التقنية (Salah Tech Group - STG). جميع الحقوق محفوظة.",
        "footerDev": "تطوير وتصميم: <strong>المهندس باقر حيدر</strong>",
        "mobileCall": "اتصال هاتفي",
        "mobileWa": "محادثة واتساب",
        "lightboxTitleDefault": "معاينة النظام",
        "lightboxBtnRequest": "طلب هذا البرنامج"
},
    en: {
        "brandTitle": "Salah Tech Group",
        "brandSubtitle": "Integrated Technology Solutions",
        "navHome": "Home",
        "navSolutions": "Software Solutions",
        "navSimulator": "Live Simulator",
        "navFeatures": "Features",
        "navPartners": "Partners",
        "navAbout": "About Us",
        "navContact": "Contact Us",
        "btnCallNav": "Direct Call",
        "navInstagramTitle": "Official Instagram Account (@stg.iq)",
        "heroBadge": "Pioneering Industrial, Oilfield & Financial Digital Software",
        "heroTitle": "High-Precision <span class=\"gradient-text\">Digital Engineering</span> for Oil, Industrial & Commercial Sectors",
        "heroSubtitle": "Salah Tech Group, led by Eng. Baqer Hayder, delivers a premier suite of specialized software: Oil Rig Monitoring Systems, PLC Industrial Automation, Government Revenue Collection, and Advanced POS & Installment Systems.",
        "btnExplore": "Explore Ready Software",
        "btnHeroWhatsapp": "Direct WhatsApp",
        "btnRequestQuote": "Request Consultation / Quote",
        "engTitle": "Eng. Baqer Hayder",
        "engRole": "Founder & Lead Systems Engineer",
        "engCompany": "Salah Tech Group",
        "engBtnConsultation": "Book Technical Consultation",
        "engTooltipCall": "Call Eng. Baqer directly",
        "engTooltipEmail": "Send technical inquiry email",
        "engTooltipIg": "Follow official Instagram account",
        "statsSolutions": "Ready Software Systems",
        "statsReliability": "Government-Grade Reliability",
        "statsIndustrial": "Industrial Automation & PLC",
        "statsSupport": "Continuous Engineering Support",
        "softwareTag": "Ready-to-Deploy Systems",
        "softwareTitle": "Advanced Software Built to Elevate Your Operations",
        "softwareDesc": "Discover our ready-to-deploy software packages with full customizability for your facility, plant, or enterprise.",
        "filterAll": "All Systems",
        "filterOil": "Oil & Industrial Sector",
        "filterPLC": "Automation & PLC Telemetry",
        "filterGov": "Government & Financial Systems",
        "filterERP": "Retail & Installments POS",
        "sys1Tag": "Oil Drilling Rigs",
        "sys1Title": "Rig Monitor System - Al-Yaman Suite (3 Integrated Systems)",
        "sys1Desc": "A specialized telemetry and sensor integration platform engineered for oil drilling rigs, providing real-time tracking of drilling parameters, high-precision gauge readouts, and immediate hazard alerts to maximize operational safety.",
        "sys1SuiteTitle": "Al-Yaman Suite includes 3 integrated software systems:",
        "sys1Pill1": "Real-Time Rig Telemetry",
        "sys1Pill2": "Industrial Sensor Integration",
        "sys1Pill3": "Early Warning & Safety System",
        "sys1F1": "<strong>Direct Telemetry:</strong> Real-time tracking of pump pressure, mud flow, torque, and drilling speed.",
        "sys1F2": "<strong>Instant Hazard Alerts:</strong> Automatic visual and audible alarms when operational safety limits are breached.",
        "sys1F3": "<strong>Certified Technical Reports:</strong> Automated logging and generation of comprehensive drilling reports for oil companies.",
        "sys1F4": "<strong>Rugged Industrial Design:</strong> High resilience and 24/7 continuous operation without performance degradation.",
        "sys1BtnPresentation": "View Presentation Deck",
        "sys1BtnServer": "Central Server Integration",
        "sys1BtnWatch": "Watch Live Simulation",
        "sys1PreviewOverlay": "Click to enlarge full system interface",
        "sys2Tag": "Oilfields & Pipelines",
        "sys2Title": "Hydrostatic Pressure Test System",
        "sys2Desc": "A precision testing software for oil & gas equipment, valves, manifolds, and Blowout Preventers (BOP), accurately plotting pressure curves and detecting leaks in compliance with international API standards.",
        "sys2F1": "<strong>Real-Time Graphing:</strong> High-frequency sampling capturing pressure rises and drops with extreme precision.",
        "sys2F2": "<strong>Automated Leak Detection:</strong> Smart algorithms identify microscopic leaks and compute drop rates instantly.",
        "sys2F3": "<strong>Official Test Certificates:</strong> Print verified technical reports complete with charts, operator sign-offs, and timestamps.",
        "sys2F4": "<strong>Multiple Unit Standards:</strong> Full support for international pressure units (PSI, BAR, MPa) with smooth toggling.",
        "sys2BtnControl": "View Pressure Test App",
        "sys2BtnDirect": "Live Pressure Simulator",
        "sys2BtnCalc": "Engineering Calibration Calculator",
        "sys2PreviewOverlay": "Click to enlarge Pressure Test interface",
        "sys3Tag": "Industrial Automation",
        "sys3Title": "Al-Razan System for PLC Reading & Sensor Calibration",
        "sys3Desc": "An industrial platform designed for direct communication with Programmable Logic Controllers (PLCs) via Modbus TCP/IP and RS485 protocols. Features advanced telemetry acquisition, sensor linearization, and multi-channel calibration.",
        "sys3F1": "<strong>Industrial Protocol Support:</strong> Full compatibility with Modbus RTU/TCP, Siemens, Schneider, and industrial PLCs.",
        "sys3F2": "<strong>Multi-Channel Calibration:</strong> Calibrate dozens of concurrent sensor channels (4-20mA, 0-10V) with custom polynomial formulas.",
        "sys3F3": "<strong>Data Logging & Archiving:</strong> Continuous historical logging to industrial databases with second-level recall accuracy.",
        "sys3F4": "<strong>Automated Diagnostics:</strong> Instant detection of telemetry drops, signal interference, and communication watchdog alarms.",
        "sys3BtnPreview": "View Al-Razan Screens",
        "sys3BtnRequest": "Request Production Line Integration",
        "sys3PreviewOverlay": "Click to enlarge Al-Razan PLC interface",
        "sys4Tag": "Public Sector & Ministries",
        "sys4Title": "Government E-Revenue Collection System",
        "sys4Desc": "A sovereign digital platform designed for ministries and state departments to manage official revenue collection rapidly and securely, offering high-level cryptographic verification and detailed multi-interval audit reports.",
        "sys4F1": "<strong>Anti-Fraud Cryptography:</strong> Issue tamper-proof digital receipts with unified sequential serial tracking and digital signatures.",
        "sys4F2": "<strong>Multi-Interval Auditing:</strong> Instant automated generation of daily, weekly, monthly, and annual financial statements.",
        "sys4F3": "<strong>Strict Hierarchy Roles:</strong> Fine-grained permission levels for cashiers, financial auditors, and account managers.",
        "sys4F4": "<strong>Central Database Sync:</strong> Secure synchronization between regional branches and the central ministry server.",
        "sys4BtnPreview": "View Revenue System Interface",
        "sys4BtnSim": "Sample E-Receipts & Statements",
        "sys4PreviewOverlay": "Click to enlarge Government Revenue interface",
        "sys5Tag": "Commercial & Retail POS",
        "sys5Title": "Al-Mayan Integrated ERP System (Stores, POS & Installments)",
        "sys5Desc": "A comprehensive business ERP software engineered for commercial stores, wholesalers, electronics centers, and installment companies. Features a robust accounting core, POS cashiers, and automated debt collection schedules.",
        "sys5F1": "<strong>Smart Installment Engine:</strong> Flexible scheduling, profit margins, grace periods, and late fees.",
        "sys5F2": "<strong>High-Speed POS Cashier:</strong> Barcode scanning, thermal receipt printing, and rapid checkout interface.",
        "sys5F3": "<strong>Multi-Warehouse Inventory:</strong> Real-time inventory tracking, low-stock warnings, and barcode label generation.",
        "sys5F4": "<strong>Customer Credit Ledgers:</strong> Complete financial statements and debt collection tracking for every customer.",
        "sys5BtnSim": "Try Smart Installment Calculator",
        "sys5BtnSample": "View Al-Mayan Interfaces",
        "sys5PreviewOverlay": "Click to enlarge Al-Mayan ERP interface",
        "simTag": "Interactive Playground",
        "simTitle": "Live Software Simulation Lab",
        "simDesc": "Experience the engineering capabilities of our software through interactive live simulations of hydrostatic pressure, PLC telemetry, and installment equations.",
        "simTabPressure": "Pressure Test Simulator (Hydrostatic)",
        "simTabPLC": "PLC Channels & Calibration Simulator",
        "simTabMayan": "Al-Mayan Installments Calculator",
        "simReadoutPsi": "Current Pressure (PSI)",
        "simReadoutDuration": "Test Duration",
        "simReadoutStatus": "Test Status",
        "simCtrlTitle": "Test Execution Controls",
        "simLabelTestedTool": "Tested Component:",
        "simLabelTargetPsi": "Target Test Pressure:",
        "simBtnStart": "Start Test",
        "simBtnStop": "Pause",
        "simBtnReset": "Reset",
        "simNotePressure": "* This simulator mirrors the actual algorithms of our Pressure Test software with real-time curve plotting.",
        "simPlcChannelsTitle": "Active Sensor Channels (Modbus TCP)",
        "simPlcCalibTitle": "Mathematical Calibration Formula",
        "simPlcNetTitle": "PLC Connection Parameters",
        "simPlcLabelIp": "Controller IP Address:",
        "simPlcLabelPort": "Modbus Port:",
        "simPlcLabelStatus": "Connection Status:",
        "simBtnPlcConnect": "Connect to PLC",
        "simMayanInputTitle": "Transaction & Installment Parameters",
        "simMayanLabelTotal": "Total Amount (IQD):",
        "simMayanLabelDown": "Down Payment (IQD):",
        "simMayanLabelMonths": "Number of Months:",
        "simMayanLabelProfit": "Annual Profit Rate (%):",
        "simMayanBtnCalc": "Calculate Installment Schedule",
        "simMayanOutputTitle": "Calculated Financial Results",
        "simMayanOutRemaining": "Remaining Principal:",
        "simMayanOutProfit": "Total Profit Amount:",
        "simMayanOutTotal": "Total with Profit:",
        "simMayanOutMonthly": "Monthly Installment Due:",
        "whyTag": "Why Choose STG?",
        "whyTitle": "Engineering Standards Rooted in Power, Security & Integration",
        "whyDesc": "We merge system engineering expertise with modern software development to deliver solutions that excel in the most demanding operational environments.",
        "feat1Title": "Oil & Industrial Standards",
        "feat1Desc": "Software compliant with international oilfield standards (API, ISO) with extreme stability under high pressure.",
        "feat2Title": "Direct Industrial PLC Interfacing",
        "feat2Desc": "Native direct communication with PLCs, microcontrollers, and multi-channel telemetry sensors.",
        "feat3Title": "Government-Grade Security",
        "feat3Desc": "Ironclad defense against tampering and multi-layered database protection suitable for sovereign institutions.",
        "feat4Title": "High-Speed Accounting Engine",
        "feat4Desc": "Process tens of thousands of complex daily transactions in fractions of a second with zero lag.",
        "feat5Title": "Bespoke System Customization",
        "feat5Desc": "Every software is fully customizable to integrate seamlessly with your unique existing infrastructure.",
        "feat6Title": "Field Support by System Engineers",
        "feat6Desc": "Ongoing technical support and consultative guidance spearheaded directly by Eng. Baqer Hayder.",
        "partnersTag": "Our Partners in Success",
        "partnersTitle": "Trusted by Industry Leaders & Businesses",
        "partnersDesc": "Proudly powering operations for distinguished corporations, oilfield logistics, and retail leaders with mission-critical digital systems.",
        "partner1Name": "Karbala Bakeries Company",
        "partner1Cat": "Commercial & Industrial Sector",
        "partner1Address": "Karbala - Hawli Sayed Jouda, Column 13550",
        "partner2Name": "Abu Turab Home Appliances",
        "partner2Cat": "Commercial & Retail Sector",
        "partner2Address": "Karbala - Al-Jamiya",
        "partner3Name": "Al-Ajlan Transport & Oilfield Services",
        "partner3Cat": "Oilfield & Transport Sector - Al-Ajlan Towers",
        "partner3Address": "Baghdad - Al-Karrada, Al-Sinaa St., Dist. 906-46",
        "partner4Name": "Flash Mobile Accessories Office",
        "partner4Cat": "Commercial & Accessories Trading",
        "partner4Address": "Karbala - Al-Jamiya",
        "aboutTag": "About the Group",
        "aboutTitle": "Salah Tech Group - Engineering Precision in Software",
        "aboutLead": "A specialized Iraqi technology enterprise founded and managed by Eng. Baqer Hayder, delivering cutting-edge software solutions.",
        "aboutBody": "Salah Tech Group was established to provide the Iraqi and regional market with mission-critical digital infrastructure. From oilfield well-monitoring systems that require millisecond-level telemetry to enterprise ERPs and government revenue networks, our solutions are engineered for zero-downtime performance and maximum security.",
        "aboutFounderLabel": "Founder & General Manager:",
        "aboutFounderValue": "Eng. Baqer Hayder",
        "aboutSpecLabel": "Core Specialization:",
        "aboutSpecValue": "Industrial Software, Rig Telemetry, PLC & Financial ERP",
        "aboutAiLabel": "Artificial Intelligence:",
        "aboutAiValue": "AI Utilization, Model Integration & Smart Software Development",
        "contactTag": "Direct Communication",
        "contactTitle": "Ready to Elevate Your Digital Infrastructure?",
        "contactDesc": "Connect directly with Eng. Baqer Hayder for consultations, software trials, or to request a tailored system demonstration.",
        "contactDirectTitle": "Official Direct Channels",
        "contactDirectDesc": "Available to discuss technical integrations, site visits, and project requirements across Iraq.",
        "contactPhone1Label": "Primary Direct Line",
        "contactPhone2Label": "Secondary Line / WhatsApp",
        "contactIgLabel": "Official Instagram Account",
        "btnCall": "Direct Call",
        "btnWhatsapp": "WhatsApp Chat",
        "btnFollowIg": "Follow @stg.iq",
        "contactEmailsTitle": "Official Email Inquiries",
        "formTitle": "Send an Inquiry / Request a Demo",
        "formDesc": "Fill in your details below to connect directly with Eng. Baqer Hayder via WhatsApp:",
        "formLabelName": "Full Name / Organization:",
        "formPlaceholderName": "e.g. Eng. Ahmed - Iraqi Drilling Co.",
        "formLabelPhone": "Phone / WhatsApp Number:",
        "formLabelSystem": "Requested Software / System:",
        "optSys1": "Rig Monitor System - Al-Yaman Suite (3 Systems)",
        "optSys2": "Hydrostatic Pressure Test System",
        "optSys3": "Al-Razan PLC Telemetry & Calibration",
        "optSys4": "Government E-Revenue Collection System",
        "optSys5": "Al-Mayan ERP (POS & Installments)",
        "optSys6": "Custom Engineering Software Development",
        "formLabelNotes": "Inquiry Details & Specifications:",
        "formPlaceholderNotes": "Write any technical details or customization requirements here...",
        "btnSendMsg": "Send Inquiry via WhatsApp",
        "footerDesc": "Salah Tech Group (STG) - Advanced engineering software solutions, oilfield rig telemetry, PLC automation, and secure enterprise financial systems.",
        "footerColSystems": "Software Systems",
        "footerSys1": "Rig Monitor System",
        "footerSys2": "Pressure Test System",
        "footerSys3": "Al-Razan PLC Telemetry",
        "footerSys4": "Government E-Revenue",
        "footerSys5": "Al-Mayan POS & Installments",
        "footerColLinks": "Quick Links",
        "footerLinkHome": "Home",
        "footerLinkSim": "Live Simulator",
        "footerLinkFeat": "Engineering Features",
        "footerLinkAbout": "About Us & AI",
        "footerLinkSlides": "System Slides & Gallery",
        "footerColContact": "Direct Contact",
        "footerEngName": "Eng. Baqer Hayder",
        "footerIg": "Instagram: @stg.iq",
        "footerCopy": "All rights reserved © 2026 - Salah Tech Group (STG).",
        "footerDev": "Designed & Developed by Lead Engineer Baqer Hayder.",
        "mobileCall": "Call",
        "mobileWa": "WhatsApp",
        "lightboxTitleDefault": "System Interface Preview",
        "lightboxBtnRequest": "Inquire About This System"
}
};

let currentLang = 'ar';
window.currentLang = currentLang;

function initBilingualSystem() {
    const langBtn = document.getElementById('btnLangToggle');
    
    // Check saved language
    const savedLang = localStorage.getItem('stg_lang') || 'ar';
    applyLanguage(savedLang);

    if (!langBtn) return;

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(currentLang);
    });
}

function applyLanguage(lang) {
    currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem('stg_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.body.className = lang === 'en' ? 'lang-en' : '';
    document.body.dir = lang === 'en' ? 'ltr' : 'rtl';

    const langBtn = document.getElementById('btnLangToggle');
    if (langBtn) {
        langBtn.innerHTML = lang === 'en' ? '<span>العربية</span>' : '<span>English</span>';
        langBtn.title = lang === 'en' ? 'التبديل إلى اللغة العربية' : 'Switch to English';
    }

    const dict = translations[lang];
    if (!dict) return;

    // 1. Text & HTML content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // 2. Input Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.placeholder = dict[key];
        }
    });

    // 3. Tooltips and Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) {
            el.title = dict[key];
        }
    });
}

/* ==========================================================================
   7. CONTACT FORM TO WHATSAPP DISPATCHER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const systemSelect = document.getElementById('targetSystem');
        const system = systemSelect ? systemSelect.options[systemSelect.selectedIndex].text : '';
        const notes = document.getElementById('clientNotes').value.trim();

        if (!name || !phone) {
            alert(currentLang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف للتواصل.' : 'Please enter your name and phone number.');
            return;
        }

        const isEn = currentLang === 'en';
        const message = isEn ?
`*Inquiry / Quote Request - Salah Tech Group*
---------------------------------------
👤 *Name:* ${name}
📞 *Phone:* ${phone}
💻 *Target System:* ${system}
📝 *Notes / Requirements:* ${notes || 'No extra notes provided'}
---------------------------------------
Sent via STG Official Website (https://stg.iq)`
:
`*طلب استفسار / عرض أسعار - مجموعة صلاح التقنية*
---------------------------------------
👤 *الاسم:* ${name}
📞 *رقم الهاتف:* ${phone}
💻 *النظام المطلوب:* ${system}
📝 *ملاحظات وتفاصيل:* ${notes || 'لا توجد ملاحظات إضافية'}
---------------------------------------
تم الإرسال عبر الموقع الإلكتروني الرسمي لمجموعة صلاح التقنية.`;

        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/9647810531340?text=${encodedMsg}`;
        window.open(whatsappUrl, '_blank');
    });
}
