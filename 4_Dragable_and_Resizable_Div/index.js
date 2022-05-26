let Mover_Wrapper = document.querySelector('.Mover_Wrapper');
let boundRect = Mover_Wrapper.getBoundingClientRect();
let Pointer = document.querySelector('.Pointer')

console.warn(boundRect.height, boundRect.width)

let content = document.querySelector('.Content');
let rect = content.getBoundingClientRect();

let resizers = document.querySelectorAll('.mover')

let IsResizing = false;

let scroll_height = 0;
let scroll_widht = 0;
window.addEventListener('scroll', ()=>{
    scroll_height = document.documentElement.scrollTop;
    scroll_widht = document.documentElement.scrollLeft;
})


let touchX, touchY, moveX = 0, moveY = 0, touchDx = 0, touchDy = 0;
let resizerTouchX, resizerTouchY, resizerMoveX = 0, resizerMoveDx = 0, resizerMoveY = 0, resizerMoveDy = 0;

let RectInitialWidth = 200, RectInitialHeight = 300;
let wrapperRight = boundRect.right - scroll_widht;
let wrapperBottom = boundRect.bottom - scroll_height;
let wrapperLeft = boundRect.left - scroll_widht;
let wrapperTop = boundRect.top - scroll_height;

let contentInitialRight = rect.right - scroll_widht;
let contentInitialBottom = rect.bottom - scroll_height;
let contentInitialLeft = rect.left - scroll_widht;
let contentInitialTop = rect.top - scroll_height;

let contentFinalRight = rect.right - scroll_widht - moveX;
let contentFinalLeft = rect.left - scroll_widht - moveX;
let contenFinalBottom = rect.bottom - scroll_height - moveY;
let contentFinalTop = rect.top - scroll_height - moveY;


const PositioningCropper = () =>{
    content.style.transform = `translate(${moveX}px, ${moveY}px)`;
    Pointer.style.transform = `translate(${moveX}px, ${moveY}px)`;
}


content.addEventListener('mousedown', mousedown);

function mousedown(e){
    e.preventDefault();

    touchX = e.clientX - moveX;
    touchY = e.clientY - moveY;


    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    function mousemove(e){
        e.preventDefault();
        if(!IsResizing){
            moveX = e.clientX - touchX;
            moveY = e.clientY - touchY;

            moveX = Math.min(
                Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
            );
            
            moveY = Math.min(
                Math.max(moveY, (wrapperTop - contentInitialTop + resizerMoveDy/2)), (wrapperBottom - contentInitialBottom - resizerMoveDy/2)
            );

            PositioningCropper();
        }
    }

    function mouseup(){
        window.removeEventListener('mouseup', mouseup);
        window.removeEventListener('mousemove', mousemove);
    }
}


for (let resizer of resizers){

    resizer.addEventListener('mousedown', resizerMouseEvent)

    function resizerMouseEvent(e){
        e.preventDefault();
        IsResizing = true;
        let thisResizer = e.target;

        resizerTouchX = e.clientX;
        resizerTouchY = e.clientY;

        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);

        function mousemove(e){
            resizerMoveX = e.clientX - resizerTouchX;
            resizerMoveY = e.clientY - resizerTouchY;
            
            if (thisResizer.classList.contains('e')){
                resizerMoveDx += resizerMoveX
                resizerMoveDx = Math.min(
                    Math.max(resizerMoveDx, (-RectInitialWidth + thisResizer.clientWidth)), (boundRect.width - RectInitialWidth)
                );
                moveX += resizerMoveX/2
                moveX = Math.min(
                    Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
                );
                content.style.width = `${RectInitialWidth + resizerMoveDx}px`;
            }
            else if (thisResizer.classList.contains('w')){
                resizerMoveDx -= resizerMoveX
                resizerMoveDx = Math.min(
                    Math.max(resizerMoveDx, (-RectInitialWidth + thisResizer.clientWidth)), (boundRect.width - (RectInitialWidth))
                );
                moveX += resizerMoveX/2
                moveX = Math.min(
                    Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
                );
                content.style.width = `${RectInitialWidth + resizerMoveDx}px`;
            }
            else if (thisResizer.classList.contains('s')){
                resizerMoveDy += resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), (boundRect.height - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (wrapperTop - contentInitialTop + resizerMoveDy/2)), (wrapperBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
            }
            else if (thisResizer.classList.contains('n')){
                resizerMoveDy -= resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), (boundRect.height - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (wrapperTop - contentInitialTop+ resizerMoveDy/2)), (wrapperBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
            }
            PositioningCropper();
            resizerTouchX = e.clientX;
            resizerTouchY = e.clientY;

        }

        function mouseup(){
            IsResizing = false;
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
        }

    }
}