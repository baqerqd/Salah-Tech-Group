/* simulators.js - Salah Tech Group
   Interactive Software Simulators:
   1. Pressure Test Live Simulator & Real-time Chart
   2. Al-Razan PLC & Calibration Simulator
   3. Al-Mayan POS & Installment Calculator
*/

document.addEventListener('DOMContentLoaded', () => {
    initPressureSimulator();
    initPLCSimulator();
    initMayanCalculator();
});

/* ==========================================================================
   1. PRESSURE TEST LIVE SIMULATOR
   ========================================================================== */
function initPressureSimulator() {
    const canvas = document.getElementById('pressureCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('btnStartPressure');
    const stopBtn = document.getElementById('btnStopPressure');
    const resetBtn = document.getElementById('btnResetPressure');
    const psiDisplay = document.getElementById('simCurrentPsi');
    const timeDisplay = document.getElementById('simTestTime');
    const statusDisplay = document.getElementById('simTestStatus');

    let isRunning = false;
    let timerInterval = null;
    let animId = null;
    let elapsedMs = 0;
    let currentPsi = 0;
    const targetPsi = 5000;
    let points = [];
    const maxPoints = 60;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function formatTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSec % 60).padStart(2, '0');
        const tenth = Math.floor((ms % 1000) / 100);
        return `${hours}:${minutes}:${seconds}.${tenth}`;
    }

    function drawChart() {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        const gridRows = 5;
        for (let i = 0; i <= gridRows; i++) {
            const y = (height / gridRows) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();

            // Label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = '10px monospace';
            const psiLabel = Math.round(targetPsi - (targetPsi / gridRows) * i) + ' PSI';
            ctx.fillText(psiLabel, 8, y - 4);
        }

        // Draw curve
        if (points.length > 1) {
            ctx.beginPath();
            const step = width / (maxPoints - 1);
            
            points.forEach((val, idx) => {
                const x = idx * step;
                const y = height - (val / targetPsi) * (height - 30) - 15;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.strokeStyle = '#00FFF5';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = 'rgba(0, 255, 245, 0.6)';
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // Area fill
            const lastIdx = points.length - 1;
            const lastX = lastIdx * step;
            ctx.lineTo(lastX, height);
            ctx.lineTo(0, height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 173, 181, 0.35)');
            gradient.addColorStop(1, 'rgba(0, 173, 181, 0.0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    drawChart();

    function updateSim() {
        if (!isRunning) return;

        elapsedMs += 100;
        timeDisplay.textContent = formatTime(elapsedMs);

        // Simulate hydrostatic pressure ramping up to target with slight realistic jitter
        if (currentPsi < targetPsi) {
            currentPsi += Math.random() * 95 + 40;
            if (currentPsi > targetPsi) currentPsi = targetPsi;
            statusDisplay.textContent = 'جاري رفع الضغط (Pressurizing...)';
            statusDisplay.style.color = '#F59E0B';
        } else {
            // Stable hold period
            currentPsi = targetPsi + (Math.random() * 20 - 10);
            statusDisplay.textContent = 'فحص مستقر ومطابق للمواصفات (Holding Stable)';
            statusDisplay.style.color = '#10B981';
        }

        psiDisplay.textContent = Math.round(currentPsi) + ' PSI';

        points.push(currentPsi);
        if (points.length > maxPoints) {
            points.shift();
        }

        drawChart();
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (isRunning) return;
            isRunning = true;
            timerInterval = setInterval(updateSim, 100);
            startBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = false;
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerInterval);
            if (startBtn) startBtn.disabled = false;
            stopBtn.disabled = true;
            statusDisplay.textContent = 'تم إيقاف الاختبار مؤقتاً (Paused)';
            statusDisplay.style.color = '#94A3B8';
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerInterval);
            elapsedMs = 0;
            currentPsi = 0;
            points = [];
            timeDisplay.textContent = '00:00:00.0';
            psiDisplay.textContent = '0 PSI';
            statusDisplay.textContent = 'جاهز لبدء الفحص (Ready)';
            statusDisplay.style.color = '#94A3B8';
            if (startBtn) startBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = true;
            drawChart();
        });
    }
}

/* ==========================================================================
   2. AL-RAZAN PLC CHANNELS SIMULATOR
   ========================================================================== */
function initPLCSimulator() {
    const connectBtn = document.getElementById('btnPlcConnect');
    const plcStatus = document.getElementById('plcStatusIndicator');
    const plcHost = document.getElementById('plcHost');
    const plcPort = document.getElementById('plcPort');
    const channelVals = document.querySelectorAll('.plc-channel-val');
    const rawInput = document.getElementById('plcRawInput');

    let isConnected = false;
    let plcInterval = null;

    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            isConnected = !isConnected;
            if (isConnected) {
                connectBtn.textContent = 'قطع الاتصال (Disconnect)';
                connectBtn.style.background = 'rgba(244, 63, 94, 0.2)';
                connectBtn.style.borderColor = '#F43F5E';
                connectBtn.style.color = '#FB7185';
                plcStatus.textContent = 'متصل (CONNECTED) - Modbus TCP Active';
                plcStatus.className = 'status-tag connected';

                plcInterval = setInterval(() => {
                    channelVals.forEach((el, index) => {
                        let base = (index + 1) * 120;
                        let jitter = Math.floor(Math.random() * 15 - 7);
                        el.textContent = (base + jitter);
                    });
                }, 800);
            } else {
                connectBtn.textContent = 'اتصال بالـ PLC (Connect)';
                connectBtn.style.background = '';
                connectBtn.style.borderColor = '';
                connectBtn.style.color = '';
                plcStatus.textContent = 'غير متصل (DISCONNECTED)';
                plcStatus.className = 'status-tag disconnected';
                clearInterval(plcInterval);
                channelVals.forEach(el => el.textContent = '0');
            }
        });
    }

    if (rawInput) {
        rawInput.addEventListener('input', (e) => {
            const val = parseInt(e.target.value) || 0;
            const calibrated = document.getElementById('plcCalibratedVal');
            if (calibrated) {
                // Example 4-20mA or linear math formula: (Raw * 0.25) + 12
                calibrated.textContent = ((val * 0.25) + 12).toFixed(2) + ' BAR';
            }
        });
    }
}

/* ==========================================================================
   3. AL-MAYAN POS & INSTALLMENTS CALCULATOR
   ========================================================================== */
function initMayanCalculator() {
    const calcBtn = document.getElementById('btnCalculateMayan');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', () => {
        const totalAmount = parseFloat(document.getElementById('posTotalAmount').value) || 0;
        const downPayment = parseFloat(document.getElementById('posDownPayment').value) || 0;
        const months = parseInt(document.getElementById('posMonths').value) || 12;
        const profitRate = parseFloat(document.getElementById('posProfitRate').value) || 0;

        const remainingPrincipal = Math.max(0, totalAmount - downPayment);
        const totalProfit = remainingPrincipal * (profitRate / 100);
        const totalWithProfit = remainingPrincipal + totalProfit;
        const monthlyInstallment = months > 0 ? (totalWithProfit / months) : 0;

        const isEn = (window.currentLang === 'en' || document.documentElement.lang === 'en');
        const curr = isEn ? ' IQD' : ' د.ع';
        const perMonth = isEn ? ' IQD / Month' : ' د.ع / شهر';

        document.getElementById('outRemainingPrincipal').textContent = remainingPrincipal.toLocaleString() + curr;
        document.getElementById('outTotalProfit').textContent = totalProfit.toLocaleString() + curr;
        document.getElementById('outTotalWithProfit').textContent = totalWithProfit.toLocaleString() + curr;
        document.getElementById('outMonthlyInstallment').textContent = Math.round(monthlyInstallment).toLocaleString() + perMonth;
    });
}
