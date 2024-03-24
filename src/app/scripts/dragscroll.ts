const first = document.getElementById('first') as HTMLDivElement;
const second = document.getElementById('second') as HTMLDivElement;

let isDown = false;
let startY: number, scrollTop: number;

function handleScroll(div: HTMLDivElement) {
    div.addEventListener('mousedown', (e) => {
        isDown = true;
        div.classList.add('active');
        startY = e.pageY - div.offsetTop;
        scrollTop = div.scrollTop;
    });
      
    div.addEventListener('mouseleave', () => {
        isDown = false;
        div.classList.remove('active');
    });
      
    div.addEventListener('mouseup', () => {
        isDown = false;
        div.classList.remove('active');
    });
      
    div.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - div.offsetTop;
        const walk = (y - startY) * 3;
        div.scrollTop = scrollTop - walk;
    });
};

handleScroll(first);
handleScroll(second);