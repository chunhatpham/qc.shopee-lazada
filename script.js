// Thay đổi link quảng cáo của bạn vào mảng này sau
const adLinks = [
    "https://demo-quang-cao.com/link-1",
    "https://demo-quang-cao.com/link-2",
    "https://demo-quang-cao.com/link-3",
    "https://demo-quang-cao.com/link-4"
];

const loader = document.getElementById('loader');
const modal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalIcon = document.getElementById('modalIcon');

function showLoader() { loader.classList.add('active'); }
function hideLoader() { loader.classList.remove('active'); }

function closeWelcomeAlert() {
    document.getElementById('welcomeAlertModal').classList.remove('active');
    showLoader();
    setTimeout(() => { hideLoader(); }, 800);
}

function showModal(title, message, isSuccess = false) {
    modalTitle.innerText = title; 
    modalMessage.innerText = message; 
    if(isSuccess) {
        modalIcon.className = "fa-solid fa-circle-check";
        modalIcon.style.color = "#34c759"; 
    } else {
        modalIcon.className = "fa-solid fa-circle-exclamation";
        modalIcon.style.color = "#ff3b30"; 
    }
    modal.classList.add('active');
}

function closeModal() { modal.classList.remove('active'); }

function submitContactForm() {
    showLoader();
    setTimeout(() => { hideLoader(); showModal('Thành Công', 'Tin nhắn của bạn đã được gửi!', true); }, 1000);
}

// QUẢN LÝ DETAIL MODAL VÀ AUDIO
const movieDetailModal = document.getElementById('movieDetailModal');
const detailTitle = document.getElementById('detailTitle');
const detailPoster = document.getElementById('detailPoster');
const watchNowBtn = document.getElementById('watchNowBtn');

const customAudioPlayer = document.getElementById('customAudioPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const speedBtn = document.getElementById('speedBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');

let isPlaying = false;

function openMovieDetail(title, linkUrl, imageUrl) {
    detailTitle.innerText = title; 
    detailPoster.style.backgroundImage = `url('${imageUrl}')`;
    
    if(linkUrl === '#') {
        watchNowBtn.style.display = 'flex';
        customAudioPlayer.style.display = 'none';
        audioPlayer.pause();
        audioPlayer.src = '';
        watchNowBtn.onclick = function(e) {
            e.preventDefault();
            showModal('Đang Cập Nhật', 'Bộ phim này hiện đang chờ cập nhật Link xem chính thức!');
        };
    } else {
        watchNowBtn.style.display = 'none';
        customAudioPlayer.style.display = 'block';
        resetPlayerUI();
        audioPlayer.src = linkUrl;
        audioPlayer.load();
    }

    movieDetailModal.classList.add('active');
}

function closeMovieDetail() { 
    movieDetailModal.classList.remove('active'); 
    audioPlayer.pause(); 
    isPlaying = false;
    playIcon.className = "fa-solid fa-play";
}

movieDetailModal.addEventListener('click', function(e) { 
    if(e.target === movieDetailModal) closeMovieDetail(); 
});

function resetPlayerUI() {
    playIcon.className = "fa-solid fa-play";
    isPlaying = false;
    progressBar.value = 0;
    currentTimeEl.innerText = "00:00";
    totalTimeEl.innerText = "00:00";
    audioPlayer.playbackRate = 1.0;
    speedBtn.innerText = "1.0x";
}

function formatTime(time) {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = "fa-solid fa-play";
        isPlaying = false;
    } else {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playIcon.className = "fa-solid fa-pause";
                isPlaying = true;
            }).catch(error => {
                showModal('Đang Kết Nối', 'Hệ Thống Đang Kết Nối Phim Vui Lòng Đợi Chút', true);
                setTimeout(() => { window.open(audioPlayer.src, '_blank'); }, 1500);
            });
        }
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    currentTimeEl.innerText = formatTime(current);
    if (!isNaN(duration) && isFinite(duration)) {
        totalTimeEl.innerText = formatTime(duration);
        progressBar.max = duration;
    }
    if (duration > 0) progressBar.value = current;
});

audioPlayer.addEventListener('loadedmetadata', () => {
    if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
        totalTimeEl.innerText = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration;
    }
});

progressBar.addEventListener('input', () => { audioPlayer.currentTime = progressBar.value; });
rewindBtn.addEventListener('click', () => { audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10); });
forwardBtn.addEventListener('click', () => { audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10); });

speedBtn.addEventListener('click', () => {
    let currentSpeed = audioPlayer.playbackRate;
    if (currentSpeed === 1.0) currentSpeed = 1.25;
    else if (currentSpeed === 1.25) currentSpeed = 1.5;
    else if (currentSpeed === 1.5) currentSpeed = 2.0;
    else currentSpeed = 1.0;
    audioPlayer.playbackRate = currentSpeed;
    speedBtn.innerText = currentSpeed + "x";
});

muteBtn.addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    if (audioPlayer.muted) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
        volumeIcon.style.color = "#ff3b30"; 
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
        volumeIcon.style.color = "var(--text-main)";
    }
});

audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.className = "fa-solid fa-play";
    progressBar.value = 0;
    audioPlayer.currentTime = 0;
});

// KHUNG PHIM VÀ LOGIC HIỆU ỨNG TRƯỚC KHI MỞ
let globalAdProgress = 0; 

function createMovieCard(isNew = false, movieName = "Siêu Phẩm Mướp Audio", movieLink = "#", imageUrl = "https://i.postimg.cc/PqCsPZtW/IMG-1910.jpg") {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    const isUpdating = (movieLink === "#");

    card.innerHTML = `
        ${isNew ? '<div class="badge-new">NEW</div>' : ''}
        <div class="movie-thumbnail">
            <div class="bg-blur" style="background-image: url('${imageUrl}'); ${!isUpdating ? 'filter: none;' : ''}"></div>
            ${isUpdating ? '<div class="update-text"><i class="fa-solid fa-spinner fa-spin" style="margin-right:5px;"></i> Đang cập nhật</div>' : ''}
        </div>
        <div class="movie-info">
            <h2 class="searchable-title">${movieName}</h2> 
        </div>
    `;
    
    card.addEventListener('click', () => {
        if (globalAdProgress < 3) {
            globalAdProgress++;
            const toast = document.getElementById('adProgressToast');
            const toastText = document.getElementById('adProgressText');
            toastText.innerText = `Tiến Độ: ${globalAdProgress}/3`;
            toast.classList.add('active');
            
            setTimeout(() => { toast.classList.remove('active'); }, 3500);
            
            const randomAd = adLinks[Math.floor(Math.random() * adLinks.length)];
            window.open(randomAd, '_blank');
            
            if (globalAdProgress === 3) {
                globalAdProgress = 0; 
                showLoader();
                setTimeout(() => {
                    hideLoader();
                    openMovieDetail(movieName, movieLink, imageUrl);
                }, 1200); 
            }
        } else {
            globalAdProgress = 0;
            showLoader();
            setTimeout(() => {
                hideLoader();
                openMovieDetail(movieName, movieLink, imageUrl);
            }, 1200);
        }
    });
    
    return card;
}

// Kho phim đã được dọn, để lại 1 phim mẫu cho bạn cập nhật sau
const realMovies = [
    {
        name: "Phim Demo Mướp Audio 1",
        link: "https://videotourl.com/audio/demo-link-audio.m4a",
        image: "https://i.postimg.cc/PqCsPZtW/IMG-1910.jpg"
    }
];

const homeGrid = document.getElementById('home-movie-grid');
const homeMovies = realMovies.slice(0, 10); 
homeMovies.forEach(movie => { homeGrid.appendChild(createMovieCard(true, movie.name, movie.link, movie.image)); });
for (let i = homeMovies.length; i < 10; i++) { homeGrid.appendChild(createMovieCard(true, "Siêu Phẩm Mướp Audio", "#", "https://i.postimg.cc/PqCsPZtW/IMG-1910.jpg")); }

let currentListPage = 1;
let totalPages = Math.ceil(realMovies.length / 10);
if (totalPages === 0) totalPages = 1;

function loadListPage(pageNumber) {
    currentListPage = pageNumber;
    showLoader();
    setTimeout(() => {
        const listGrid = document.getElementById('list-movie-grid');
        listGrid.innerHTML = ''; 
        const startIndex = (pageNumber - 1) * 10;
        const pageMovies = realMovies.slice(startIndex, startIndex + 10);
        pageMovies.forEach(movie => { listGrid.appendChild(createMovieCard((pageNumber === 1), movie.name, movie.link, movie.image)); });
        for (let i = pageMovies.length; i < 10; i++) { listGrid.appendChild(createMovieCard(false, "Siêu Phẩm Mướp Audio", "#", "https://i.postimg.cc/PqCsPZtW/IMG-1910.jpg")); }
        renderPagination();
        hideLoader();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, 800);
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); str = str.replace(/đ/g,"d"); return str.toLowerCase().trim();
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) document.getElementById('searchInput').focus();
});

document.getElementById('executeSearch').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if(query === '') { showModal('Lỗi', 'Vui lòng nhập tên truyện!'); return; }
    document.getElementById('searchBar').classList.remove('active');
    showLoader();
    setTimeout(() => {
        const normalizedQuery = removeVietnameseTones(query);
        const foundIndex = realMovies.findIndex(movie => removeVietnameseTones(movie.name).includes(normalizedQuery));
        if (foundIndex !== -1) {
            const foundMovie = realMovies[foundIndex];
            const targetPage = Math.floor(foundIndex / 10) + 1; 
            if (!document.getElementById('list-tab').classList.contains('active')) { switchTab('list-tab', targetPage); } 
            else { loadListPage(targetPage); }
            setTimeout(() => {
                hideLoader();
                const allCards = document.querySelectorAll('#list-tab .movie-card');
                let targetCard = null;
                for (let card of allCards) {
                    if (card.querySelector('.searchable-title').innerText === foundMovie.name) { targetCard = card; break; }
                }
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.classList.add('highlight-card');
                    setTimeout(() => targetCard.classList.remove('highlight-card'), 3000); 
                    showModal('Tìm Thấy', `Đã tìm thấy: ${foundMovie.name}!`, true);
                    searchInput.value = '';
                }
            }, 800); 
        } else {
            hideLoader();
            showModal('Không Tìm Thấy', `Rất tiếc, không tìm thấy phim nào.`);
        }
    }, 800); 
});

const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
function closeMenu() { sideMenu.classList.remove('active'); menuOverlay.classList.remove('active'); }
document.getElementById('menuBtn').addEventListener('click', () => { sideMenu.classList.add('active'); menuOverlay.classList.add('active'); });
document.getElementById('closeMenuBtn').addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu); 

function renderPagination() {
    const paginationContainer = document.getElementById('list-pagination');
    let html = '';
    const prevClass = currentListPage === 1 ? 'disabled' : '';
    html += `<button class="page-btn ${prevClass}" onclick="if(currentListPage > 1) loadListPage(currentListPage - 1)"><i class="fa-solid fa-angle-left"></i></button>`;
    html += `<button class="page-btn ${currentListPage === 1 ? 'active' : ''}" onclick="loadListPage(1)">1</button>`;
    if (currentListPage > 3 && totalPages > 1) html += `<span class="page-btn dots">...</span>`;
    
    let start = Math.max(2, currentListPage - 1);
    let end = Math.min(totalPages - 1, currentListPage + 1);
    if (currentListPage === 1) end = Math.min(4, totalPages - 1);
    if (currentListPage === totalPages && totalPages > 3) start = Math.max(2, totalPages - 3);
    
    for (let i = start; i <= end; i++) { html += `<button class="page-btn ${currentListPage === i ? 'active' : ''}" onclick="loadListPage(${i})">${i}</button>`; }
    
    if (currentListPage < totalPages - 2 && totalPages > 1) html += `<span class="page-btn dots">...</span>`;
    if (totalPages > 1) { html += `<button class="page-btn ${currentListPage === totalPages ? 'active' : ''}" onclick="loadListPage(${totalPages})">${totalPages}</button>`; }
    
    const nextClass = currentListPage === totalPages ? 'disabled' : '';
    html += `<button class="page-btn ${nextClass}" onclick="if(currentListPage < totalPages) loadListPage(currentListPage + 1)"><i class="fa-solid fa-angle-right"></i></button>`;
    paginationContainer.innerHTML = html;
}

const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
function switchTab(targetId, targetPage = 1) {
    closeMenu(); showLoader(); 
    setTimeout(() => {
        tabContents.forEach(tab => tab.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active-link'));
        document.getElementById(targetId).classList.add('active');
        const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        if(activeLink) activeLink.classList.add('active-link');
        
        if(targetId === 'list-tab') { loadListPage(targetPage); } 
        else { hideLoader(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }, 600);
}

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        if(!this.classList.contains('active-link')) switchTab(this.getAttribute('data-target'));
        else closeMenu(); 
    });
});

document.getElementById('logoBtn').addEventListener('click', () => {
    const homeLink = document.querySelector(`.nav-link[data-target="home-tab"]`);
    if(!homeLink.classList.contains('active-link')) switchTab('home-tab');
});

renderPagination();
