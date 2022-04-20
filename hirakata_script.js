const hiragana_chars = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', '', 'ゆ', '', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', '', '', '', 'を', '', '', '', '', 'ん', 'が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'];
 
const katakana_chars = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', '', 'ユ', '', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', '', '', '', 'ヲ', '', '', '', '', 'ン', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'];
 
const english_chars = ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', '', 'yu', '', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', '', '', '', 'wo', '', '', '', '', 'n', 'ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'di', 'du', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po'];
 
const FIVE_CHARS = ['A', 'I', 'U', 'E', 'O'];
 
var modal = document.getElementById("myModal");
 
const canvas = document.getElementById('drawing_board');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');
 
let brush_size = Math.round(window.innerHeight / 25);
let drawing_stack = [];
 
let isPainting = false;
let lineWidth = brush_size;
let offsetX;
let offsetY;
 
let hira;
let alt = false;
let engl;
 
function load() {
    $(function() {
        load_helper('hira', hiragana_chars);
        load_helper('kata', katakana_chars);
    });
    let text = document.lastModified;
	document.getElementById("last_updated").innerHTML = "Last Updated On: " + text;
}

function load_helper(kana, array) {
    let num_cols = hiragana_chars.length / 5;
    let tab = document.getElementById(kana + '_tab');
    for (let i = num_cols - 1; i >= 0; i--) {
        let new_col = document.createElement('div');
        new_col.className = kana + '_col';
        if (i > 10) {
            new_col.className += ' ' + kana + '_alt';
        }
        let top_letter = document.createElement('button');
        top_letter.className = 'letter_buttons letter_' + kana;
        let current_index = i * 5;
        if (i == 10) {
            top_letter.innerHTML = 'n';
        } else {
            top_letter.innerHTML = english_chars[current_index].charAt(0);
        }
        new_col.append(top_letter);
        for (let j = 0; j < 5; j++) {
            let new_button = document.createElement('button');
            let engl_div = document.createElement('div');
            engl_div.className = 'kana_english';
            if (english_chars[current_index + j] == '') {
                new_button.className = 'kana_buttons nope';
                new_button.innerHTML = '&ZeroWidthSpace;';
                engl_div.innerHTML = '&ZeroWidthSpace;';
            } else {
                new_button.className = 'kana_buttons';
                //TODO hardcode the gifs for the alts lmao
                new_button.setAttribute('onclick', 'open_modal("' + array[current_index + j] + '")');
                new_button.innerHTML = array[current_index + j];
                engl_div.innerHTML = english_chars[current_index + j];
            }
            
            if ((i == 0 && j == 0) || (i == 11 && j == 0)) {
                new_button.style.borderStyle = "solid solid solid solid";
            } else if (i == 0 || i == 11) {
                new_button.style.borderStyle = "none solid solid solid";
            } else if (j == 0) {
                new_button.style.borderStyle = "solid none solid solid";
            }
            new_button.append(engl_div);
            new_col.append(new_button);
        }

        tab.append(new_col);
    }
    let new_col = document.createElement('div');
    new_col.className = kana + '_col';
    let alt_button = document.createElement('button');
    alt_button.className = 'switch_button';
    alt_button.setAttribute('onclick', 'switch_to_alt()');
    if (kana == 'hira') {
        alt_button.innerHTML = 'が';
    } else {
        alt_button.innerHTML = 'ガ';
    }
    new_col.append(alt_button);

    for (let i = 0; i < 5; i++) {
        let new_button = document.createElement('button');
        new_button.className = 'kana_buttons letter_' + kana + ' nope';
        new_button.innerHTML = FIVE_CHARS[i];
        let engl_div = document.createElement('div');
        engl_div.className = 'kana_english nope';
        engl_div.innerHTML = '&ZeroWidthSpace;';
        new_button.append(engl_div);
        new_col.append(new_button);
    }
    tab.append(new_col);
}
 
function openTab(evt, tabName) {
    var i, tabcontent, tablinks, mainpage;
    mainpage = document.getElementById("front_page");
    mainpage.style.display = "none";
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    if (tabName == 'front_page') {
        document.getElementById(tabName).style.display = "block";
    } else {
        document.getElementById(tabName).style.display = "flex";
    }
    evt.target.className += " active";
    hira = tabName == 'hira_tab';
    color_switcher();
}

function color_switcher() {
    let modal_content = document.getElementsByClassName('modal-content');
    let toolbar_buttons = document.getElementsByClassName('toolbar_button');
    if (hira) {
        modal_content[0].style.backgroundImage = "url('images/hirascroll.png')"
        for (let i = 0; i < toolbar_buttons.length - 1; i++) {
            toolbar_buttons[i].style.backgroundColor = 'red';
        }
        document.getElementById('line_width_box').style.backgroundColor = 'red';
    } else {
        modal_content[0].style.backgroundImage = "url('images/katascroll.png')"
        for (let i = 0; i < toolbar_buttons.length - 1; i++) {
            toolbar_buttons[i].style.backgroundColor = 'blue';
        }
        document.getElementById('line_width_box').style.backgroundColor = 'blue';
    }

}
 
function switch_to_alt() {
    let switch_button = document.getElementsByClassName('switch_button');
    let switch_index, original_cols, alts;
    if (hira) {
        original_cols = document.getElementsByClassName('hira_col');
        alts = document.getElementsByClassName('hira_alt');
        switch_index = 0;
    } else {
        original_cols = document.getElementsByClassName('kata_col');
        alts = document.getElementsByClassName('kata_alt');
        switch_index = 1;
    }
    if (alt) {
        alt = false;
        switch_button[switch_index].className = switch_button[0].className.replace(" active", "");
        for (let i = 0; i < alts.length; i++) {
            alts[i].style.display = 'none';
        }
        for (let i = 5; i < original_cols.length; i++) {
            original_cols[i].style.display = 'flex';
        }
 
    } else {
        alt = true;
        switch_button[switch_index].className += " active";
        for (let i = 5; i < original_cols.length - 1; i++) {
            original_cols[i].style.display = 'none';
        }
        for (let i = 0; i < alts.length; i++) {
            alts[i].style.display = 'flex';
        }
 
    }
 
}
 
function open_modal(kana, ) {
    if (hira) {
        engl = english_chars[hiragana_chars.indexOf(kana)];
        document.getElementById("kanji_gif").setAttribute("src", "gifs/hiragana_gifs/" + engl + ".gif");
        document.getElementById("display_english").innerHTML = engl;
    } else {
        engl = english_chars[katakana_chars.indexOf(kana)];
        document.getElementById("kanji_gif").setAttribute("src", "gifs/katakana_gifs/" + engl + ".gif");
        document.getElementById("display_english").innerHTML = engl;
    }
    document.getElementById("kanji_gif").style.display = "block";
    document.getElementById("line_width").value = lineWidth;
    document.getElementById("display_kanji").innerHTML = kana;
    document.body.style.overflow = "hidden";
    modal.style.display = "block";
 
    var board = canvas.getBoundingClientRect();
    offsetX = board.left;
    offsetY = board.top;
    canvas.width = window.innerWidth * (.8);
    canvas.height = window.innerHeight * (.69);
}
 
function close_modal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawing_stack.splice(0, drawing_stack.length);
    isPainting = false;
    ctx.beginPath();
    document.body.style.overflow = "auto";
    modal.style.display = "none";
}
 
toolbar.addEventListener('change', e => {
    if(e.target.id === 'line_width') {
        lineWidth = e.target.value;
    }
});
 
function clear_drawing() {
    drawing_stack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
 
function undo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(drawing_stack.pop(), 0, 0);
}
 
function sound() {
    let audio = document.getElementById("audio");
    audio.setAttribute("src", "audio/" + engl + ".mp3");
    audio.play();
}
 
const draw = (e) => {
    if(!isPainting) {
            return;
    }
   
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY);
    ctx.stroke();
}
 
canvas.addEventListener('pointerdown', (e) => {
    drawing_stack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); //push image before drawing
    isPainting = true;
});
 
canvas.addEventListener('pointerup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});
 
canvas.addEventListener('pointermove', draw);
 
window.addEventListener("keydown", e => {
    if (modal.style.display == "block") {
        if (e.key == "Escape") {
            close_modal();
        } else if (e.key == "Backspace" || e.code == "KeyC") {
            clear_drawing();
        } else if (e.code == "KeyZ") {
            undo();
        }
}
});
 
 

