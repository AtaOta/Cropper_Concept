let Mover_Wrapper = document.querySelector('.Mover_Wrapper');
let boundRect = Mover_Wrapper.getBoundingClientRect();

console.warn(boundRect.height, boundRect.width)

let content = document.querySelector('.Content');
let rect = content.getBoundingClientRect();


let scroll_height = 0;
let scroll_widht = 0;
window.addEventListener('scroll', ()=>{
    scroll_height = document.documentElement.scrollTop;
    scroll_widht = document.documentElement.scrollLeft;
})


let touchX, touchY, moveX = 0, moveY =0; 


let wrapperRight = boundRect.right - scroll_widht;
let wrapperBottom = boundRect.bottom - scroll_height;
let wrapperLeft = boundRect.left - scroll_widht;
let wrapperTop = boundRect.top - scroll_height;

let contentInitialRight = rect.right - scroll_widht;
let contentInitialBottom = rect.bottom - scroll_height;
let contentInitialLeft = rect.left - scroll_widht;
let contentInitialTop = rect.top - scroll_height;



content.addEventListener('mousedown', mousedown);

function mousedown(e){
    e.preventDefault();

    touchX = e.clientX - moveX;
    touchY = e.clientY - moveY;


    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    function mousemove(e){
        e.preventDefault();
        moveX = e.clientX - touchX;
        moveY = e.clientY - touchY;
        
        moveX = Math.min(
            Math.max(moveX, (wrapperLeft - contentInitialLeft)), (wrapperRight - contentInitialRight)
        );
        
        moveY = Math.min(
            Math.max(moveY, (wrapperTop - contentInitialTop)), (wrapperBottom - contentInitialBottom)
        );

        content.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    function mouseup(){
        window.removeEventListener('mouseup', mouseup);
        window.removeEventListener('mousemove', mousemove);
    }
}