// --- (A) DATA & PENYIMPANAN ---

// Data kuis default (soal-soal awal dari file kamu)
const defaultQuizData = [
    {
        question: "Apa satu-satunya mamalia yang bisa terbang?",
        options: ["Tupai Terbang", "Kelelawar", "Burung Hantu", "Pterodactyl"],
        correctAnswer: "Kelelawar",
        funFact: "Meskipun 'tupai terbang' memiliki nama itu, mereka sebenarnya meluncur (glide), bukan terbang secara aktif seperti kelelawar."
    },
    {
        question: "Planet manakah di tata surya kita yang terkenal dengan 'Cincin'-nya?",
        options: ["Jupiter", "Mars", "Saturnus", "Neptunus"],
        correctAnswer: "Saturnus",
        funFact: "Tahukah kamu? Jupiter, Uranus, dan Neptunus sebenarnya juga memiliki cincin, tetapi cincin Saturnus adalah yang paling besar dan terlihat jelas."
    },
    {
        question: "Apa ibukota dari Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: "Canberra",
        funFact: "Canberra dipilih sebagai ibukota kompromi pada tahun 1908 karena Sydney dan Melbourne (dua kota terbesar) bersaing untuk menjadi ibukota."
    },
    {
        question: "Berapa banyak hati yang dimiliki oleh seekor gurita?",
        options: ["Satu", "Dua", "Tiga", "Empat"],
        correctAnswer: "Tiga",
        funFact: "Gurita memiliki tiga hati. Dua hati memompa darah ke insang, sementara hati ketiga memompa darah ke seluruh tubuh."
    },
    {
        question: "Gunung tertinggi di dunia adalah...",
        options: ["K2", "Gunung Everest", "Kangchenjunga", "Makalu"],
        correctAnswer: "Gunung Everest",
        funFact: "Meskipun Everest adalah yang tertinggi di atas permukaan laut, Mauna Kea di Hawaii sebenarnya 'lebih tinggi' jika diukur dari dasarnya di dasar laut."
    }
];

// Fungsi untuk menginisialisasi data di LocalStorage jika belum ada
function initializeData() {
    if (!localStorage.getItem('quizData')) {
        localStorage.setItem('quizData', JSON.stringify(defaultQuizData));
    }
}

// Fungsi untuk mengambil data kuis dari LocalStorage
function getQuizData() {
    initializeData(); // Pastikan data ada
    return JSON.parse(localStorage.getItem('quizData'));
}

// Fungsi untuk menyimpan data kuis ke LocalStorage
function saveQuizData(data) {
    localStorage.setItem('quizData', JSON.stringify(data));
}

// --- (B) LOGIKA OTENTIKASI (LOGIN) ---

function handleLogin(event) {
    event.preventDefault(); // Mencegah form reload halaman
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');

    if (username === 'admin' && password === 'admin123') {
        // Login sebagai admin
        sessionStorage.setItem('userRole', 'admin'); // Simpan status login
        window.location.href = 'admin.html'; // Pindah ke halaman admin
    } else if (username === 'user' && password === '1234') {
        // Login sebagai user
        sessionStorage.setItem('userRole', 'user'); // Simpan status login
        window.location.href = 'kuis.html'; // Pindah ke halaman kuis
    } else {
        // Login gagal
        loginError.classList.remove('hidden');
    }
}

function handleLogout() {
    sessionStorage.removeItem('userRole'); // Hapus status login
    window.location.href = 'login.html'; // Kembali ke halaman login
}

// --- (C) LOGIKA HALAMAN KUIS ---

// Variabel state untuk halaman kuis
let currentQuestionIndex = 0;
let score = 0;
let quizData = []; // Akan diisi saat kuis dimulai

// Elemen DOM Halaman Kuis (didefinisikan di sini agar tidak error)
let startScreen, quizScreen, endScreen, startButton, nextButton, restartButton;
let questionText, optionsContainer, feedbackContainer, feedbackText, funFactText;
let scoreDisplay, finalScoreDisplay, questionNumberDisplay, totalQuestionsDisplay;

// Fungsi untuk inisialisasi dan menjalankan halaman kuis
function initQuizPage() {
    // Cek apakah user sudah login sebagai 'user'
    if (sessionStorage.getItem('userRole') !== 'user') {
        alert('Anda harus login sebagai user untuk bermain!');
        window.location.href = 'login.html';
        return;
    }

    // Ambil semua elemen DOM
    startScreen = document.getElementById('start-screen');
    quizScreen = document.getElementById('quiz-screen');
    endScreen = document.getElementById('end-screen');
    
    startButton = document.getElementById('start-button');
    nextButton = document.getElementById('next-button');
    restartButton = document.getElementById('restart-button');
    
    questionText = document.getElementById('question-text');
    optionsContainer = document.getElementById('options-container');
    feedbackContainer = document.getElementById('feedback-container');
    feedbackText = document.getElementById('feedback-text');
    funFactText = document.getElementById('fun-fact-text');
    
    scoreDisplay = document.getElementById('score');
    finalScoreDisplay = document.getElementById('final-score');
    questionNumberDisplay = document.getElementById('question-number');
    totalQuestionsDisplay = document.getElementById('total-questions');

    // Tambahkan event listener
    startButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', handleNext);
    restartButton.addEventListener('click', startQuiz);
    
    // Tombol logout di halaman kuis
    const logoutButtonQuiz = document.getElementById('logout-button-quiz');
    if (logoutButtonQuiz) {
        logoutButtonQuiz.addEventListener('click', handleLogout);
    }
}

// Fungsi-fungsi kuis (diambil dari kode aslimu, sedikit diubah)
function startQuiz() {
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    quizData = getQuizData(); // AMBIL DATA DARI LOCALSTORAGE
    
    scoreDisplay.textContent = score;
    totalQuestionsDisplay.textContent = quizData.length;
    
    showQuestion();
}

function showQuestion() {
    feedbackContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    optionsContainer.innerHTML = ''; 

    const questionData = quizData[currentQuestionIndex];
    questionText.textContent = questionData.question;
    questionNumberDisplay.textContent = currentQuestionIndex + 1;

    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add(
            'w-full', 'bg-slate-700', 'hover:bg-slate-600', 'text-white', 
            'text-md', 'font-semibold', 'py-3', 'px-5', 'rounded-lg', 
            'transition-all', 'duration-200', 'text-left'
        );
        button.addEventListener('click', () => selectAnswer(option, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedOption, selectedButton) {
    const correctAnwer = quizData[currentQuestionIndex].correctAnswer;
    const isCorrect = (selectedOption === correctAnwer);

    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnwer) {
            button.classList.remove('bg-slate-700', 'hover:bg-slate-600');
            button.classList.add('bg-green-500', 'text-white');
        } else if (button === selectedButton) {
            button.classList.remove('bg-slate-700', 'hover:bg-slate-600');
            button.classList.add('bg-red-500', 'text-white');
        }
    });

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = score;
        feedbackText.textContent = "Benar!";
        feedbackText.classList.remove('text-red-400');
        feedbackText.classList.add('text-green-400');
    } else {
        feedbackText.textContent = "Salah!";
        feedbackText.classList.remove('text-green-400');
        feedbackText.classList.add('text-red-400');
    }

    funFactText.textContent = quizData[currentQuestionIndex].funFact;
    feedbackContainer.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}

function handleNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `${score} dari ${quizData.length}`;
}

// --- (D) LOGIKA HALAMAN ADMIN ---

// Elemen DOM Halaman Admin
let questionListContainer, questionForm, formTitle, questionId;
let questionTextInput, option1, option2, option3, option4, correctAnswerInput, funFactInput, cancelEditButton;

function initAdminPage() {
    // Cek apakah user sudah login sebagai 'admin'
    if (sessionStorage.getItem('userRole') !== 'admin') {
        alert('Anda tidak memiliki akses ke halaman ini!');
        window.location.href = 'login.html';
        return;
    }

    // Ambil elemen DOM
    questionListContainer = document.getElementById('question-list-container');
    questionForm = document.getElementById('question-form');
    formTitle = document.getElementById('form-title');
    questionId = document.getElementById('question-id');
    
    questionTextInput = document.getElementById('question-text-input');
    option1 = document.getElementById('option-1');
    option2 = document.getElementById('option-2');
    option3 = document.getElementById('option-3');
    option4 = document.getElementById('option-4');
    correctAnswerInput = document.getElementById('correct-answer-input');
    funFactInput = document.getElementById('fun-fact-input');
    cancelEditButton = document.getElementById('cancel-edit-button');

    // Tambahkan event listener
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    questionForm.addEventListener('submit', handleFormSubmit);
    cancelEditButton.addEventListener('click', resetForm);

    // Tampilkan daftar soal saat halaman dimuat
    renderQuestionList();
}

// Fungsi untuk menampilkan daftar soal di admin panel
function renderQuestionList() {
    const questions = getQuizData();
    questionListContainer.innerHTML = ''; // Kosongkan daftar

    if (questions.length === 0) {
        questionListContainer.innerHTML = '<p class="text-slate-400">Belum ada soal. Silakan tambahkan!</p>';
        return;
    }

    questions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'p-4 bg-slate-700 rounded-lg flex justify-between items-start';
        item.innerHTML = `
            <div>
                <p class="font-bold text-lg">${index + 1}. ${q.question}</p>
                <ul class="list-disc list-inside text-sm text-slate-300 pl-2">
                    ${q.options.map(opt => `<li>${opt} ${opt === q.correctAnswer ? '(Benar)' : ''}</li>`).join('')}
                </ul>
            </div>
            <div class="flex-shrink-0 flex gap-2">
                <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded" data-index="${index}">Edit</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded" data-index="${index}">Hapus</button>
            </div>
        `;
        questionListContainer.appendChild(item);
    });

    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editQuestion(btn.dataset.index));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteQuestion(btn.dataset.index));
    });
}

// Fungsi untuk submit form (tambah atau edit)
function handleFormSubmit(event) {
    event.preventDefault();

    const newQuestion = {
        question: questionTextInput.value,
        options: [
            option1.value,
            option2.value,
            option3.value,
            option4.value
        ],
        correctAnswer: correctAnswerInput.value,
        funFact: funFactInput.value
    };

    const questions = getQuizData();
    const id = questionId.value; // Ambil ID untuk mode edit

    if (id) {
        // Mode Edit: Perbarui data di index tersebut
        questions[id] = newQuestion;
    } else {
        // Mode Tambah: Tambahkan data baru
        questions.push(newQuestion);
    }

    saveQuizData(questions); // Simpan ke LocalStorage
    renderQuestionList(); // Perbarui tampilan daftar
    resetForm(); // Kosongkan form
}

// Fungsi untuk menghapus soal
function deleteQuestion(index) {
    if (!confirm('Apakah kamu yakin ingin menghapus soal ini?')) {
        return;
    }

    const questions = getQuizData();
    questions.splice(index, 1); // Hapus 1 elemen di index
    saveQuizData(questions);
    renderQuestionList();
}

// Fungsi untuk masuk ke mode edit soal
function editQuestion(index) {
    const questions = getQuizData();
    const q = questions[index];

    // Isi form dengan data soal
    formTitle.textContent = "Edit Soal";
    questionId.value = index; // Simpan index sebagai ID
    questionTextInput.value = q.question;
    option1.value = q.options[0] || '';
    option2.value = q.options[1] || '';
    option3.value = q.options[2] || '';
    option4.value = q.options[3] || '';
    correctAnswerInput.value = q.correctAnswer;
    funFactInput.value = q.funFact;
    
    cancelEditButton.classList.remove('hidden'); // Tampilkan tombol batal
    window.scrollTo(0, 0); // Gulir ke atas ke form
}

// Fungsi untuk mengosongkan form dan kembali ke mode tambah
function resetForm() {
    questionForm.reset();
    formTitle.textContent = "Tambah Soal Baru";
    questionId.value = ''; // Hapus ID
    cancelEditButton.classList.add('hidden'); // Sembunyikan tombol batal
}

// --- (E) ROUTER SEDERHANA ---
// Fungsi ini akan berjalan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('login.html') || path.endsWith('/')) {
        // Jika di halaman login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    } else if (path.endsWith('kuis.html')) {
        // Jika di halaman kuis
        initQuizPage();
    } else if (path.endsWith('admin.html')) {
        // Jika di halaman admin
        initAdminPage();
    }
});