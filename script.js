const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "Hem",
    "Chắc hem đó? 🤔",
    "Sao chọn hem hoài dạ... 🥺",
    "Chọn hem hoài, Minh Minh buồn lắm đó...",
    "Buồn thiệt đó... 😢",
    "Hem đi chơi với anh 😏",
    "Hemmmmmm...",
    "Lần cuối! 😭",
    "Chọn hem hông được đâu 😜"
]

const yesTeasePokes = [
    "thử chọn hem thử... Anh chắc là me me hông chọn có liền đâu 😏",
    "thử chọn hem 1 lần đi nèo... 👀",
    "Có bất ngờ đó 😈",
    "Chọn hem đi 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button each time, but keep it within the phone screen
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    const maxFontSize = Math.min(52, Math.max(28, window.innerWidth * 0.14))
    const nextSize = Math.min(currentSize * 1.25, maxFontSize)
    yesBtn.style.fontSize = `${nextSize}px`

    const maxPadY = Math.round(window.innerHeight * 0.12)
    const maxPadX = Math.round(window.innerWidth * 0.42)
    const padY = Math.min(18 + noClickCount * 5, maxPadY)
    const padX = Math.min(45 + noClickCount * 10, maxPadX)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 16
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight

    // Avoid placing the No button under the music toggle (bottom-right)
    const toggle = document.getElementById('music-toggle')
    const toggleRect = toggle ? toggle.getBoundingClientRect() : null
    const reservedRight = toggleRect ? (window.innerWidth - toggleRect.left + 8) : 0
    const reservedBottom = toggleRect ? (window.innerHeight - toggleRect.top + 8) : 0

    const maxX = Math.max(margin, window.innerWidth - btnW - margin - reservedRight)
    const maxY = Math.max(margin, window.innerHeight - btnH - margin - reservedBottom)

    const randomX = margin + Math.random() * Math.max(0, (maxX - margin))
    const randomY = margin + Math.random() * Math.max(0, (maxY - margin))

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '150'
}
