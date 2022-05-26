let ImageWrapper = document.querySelector('.Moveble_Image_Wrapper');
let imgWrapperRect = ImageWrapper.getBoundingClientRect();

let Mover_Wrapper = document.querySelector('.Mover_Wrapper');
let boundRect = Mover_Wrapper.getBoundingClientRect();

let content = document.querySelector('.Content');
let rect = content.getBoundingClientRect();

let resizers = document.querySelectorAll('.mover')

let rotate = 0
let RotorRight = document.querySelector('#RotateRight');
let RotorLeft = document.querySelector('#RotateLeft');


let scroll_height = 0;
let scroll_widht = 0;
let imgTouchX, imgTouchY, imgMoveX = 0, imgMoveY = 0, scale = 1; 
let touchX, touchY, moveX = 0, moveY = 0, touchDx = 0, touchDy = 0;
let resizerTouchX, resizerTouchY, resizerMoveX = 0, resizerMoveDx = 0, resizerMoveY = 0, resizerMoveDy = 0;
let RectInitialWidth = 100, RectInitialHeight = 100;
let IsResizing = false;
window.addEventListener('scroll', ()=>{
    scroll_height = document.documentElement.scrollTop;
    scroll_widht = document.documentElement.scrollLeft;
})

let ImageWrapperRight = imgWrapperRect.right - scroll_widht;
let ImageWrapperBottom = imgWrapperRect.bottom - scroll_height;
let ImageWrapperLeft = imgWrapperRect.left - scroll_widht;
let ImageWrapperTop = imgWrapperRect.top - scroll_height;

let contentInitialRight = rect.right - scroll_widht;
let contentInitialBottom = rect.bottom - scroll_height;
let contentInitialLeft = rect.left - scroll_widht;
let contentInitialTop = rect.top - scroll_height;

let wrapperRight = boundRect.right - scroll_widht;
let wrapperBottom = boundRect.bottom - scroll_height;
let wrapperLeft = boundRect.left - scroll_widht;
let wrapperTop = boundRect.top - scroll_height;
      
let contenFinalBottom = rect.bottom - scroll_height - moveY;
let contentFinalTop = rect.top - scroll_height - moveY;

let rectMaxTop = ((imgWrapperRect.top + imgMoveY) <= (wrapperTop)) ? (wrapperTop):(imgWrapperRect.top + imgMoveY);       
let rectMaxBottom = ((imgWrapperRect.bottom + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom):(imgWrapperRect.bottom + imgMoveY);




ImageWrapper.addEventListener('mousedown', imgMousedown);

function imgMousedown(e){
    e.preventDefault();

    imgTouchX = e.clientX - imgMoveX;
    imgTouchY = e.clientY - imgMoveY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);

    function mousemove(e){
        e.preventDefault();
        imgMoveX = e.clientX - imgTouchX;
        imgMoveY = e.clientY - imgTouchY;

        ImageWrapperRight = imgWrapperRect.right - scroll_widht;
        ImageWrapperBottom = imgWrapperRect.bottom - scroll_height;
        ImageWrapperLeft = imgWrapperRect.left - scroll_widht;
        ImageWrapperTop = imgWrapperRect.top  - scroll_height;
      
        contenFinalBottom = rect.bottom - scroll_height - moveY + resizerMoveDy/2;
        contentFinalTop = rect.top - scroll_height - moveY - resizerMoveDy/2;

        imgMoveX = Math.min(
            Math.max(imgMoveX, (wrapperRight - ImageWrapperRight)), (wrapperLeft - ImageWrapperLeft)
        );
        
        imgMoveY = Math.min(
            Math.max(imgMoveY, (ImageWrapperTop - contentFinalTop)), (ImageWrapperBottom - contenFinalBottom)
        );

        ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scale}) rotate(${rotate}deg)`;
    }

    function mouseup(){
        window.removeEventListener('mouseup', mouseup);
        window.removeEventListener('mousemove', mousemove);
    }
}




content.addEventListener('mousedown', contentMousedown);

function contentMousedown(e){
    e.preventDefault();
    CropperMove = true;

    touchX = e.clientX - moveX;
    touchY = e.clientY - moveY;


    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);


    function mousemove(e){
        if(!IsResizing){
            moveX = e.clientX - touchX;
            moveY = e.clientY - touchY;

            rectMaxTop = ((imgWrapperRect.top + imgMoveY) <= (wrapperTop)) ? (wrapperTop):(imgWrapperRect.top + imgMoveY);
            
            rectMaxBottom = ((imgWrapperRect.bottom + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom):(imgWrapperRect.bottom + imgMoveY);

            moveX = Math.min(
                Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
            );
            
            moveY = Math.min(
                Math.max(moveY, (rectMaxTop - contentInitialTop + resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
            );

            content.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }

    function mouseup(){
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }

}


const PositioningCropper = () =>{
    content.style.transform = `translate(${moveX}px, ${moveY}px)`;
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
            

            rectMaxTop = ((imgWrapperRect.top + imgMoveY) <= (wrapperTop)) ? (wrapperTop):(imgWrapperRect.top + imgMoveY);
            
            rectMaxBottom = ((imgWrapperRect.bottom + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom):(imgWrapperRect.bottom + imgMoveY);
            
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
            else if (thisResizer.classList.contains('se')){
                resizerMoveDx += resizerMoveX


                resizerMoveDx = Math.min(
                    Math.max(resizerMoveDx, (-RectInitialWidth + thisResizer.clientWidth)), (boundRect.width - RectInitialWidth)
                );

                moveX += resizerMoveX/2
                moveX = Math.min(
                    Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
                );
                
                resizerMoveDy += resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop + resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.width = `${RectInitialWidth + resizerMoveDx}px`;
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`; 
            }
            
            else if (thisResizer.classList.contains('s')){
                resizerMoveDy += resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop + resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
            }
            else if (thisResizer.classList.contains('sw')){
                resizerMoveDy += resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop + resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
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

            
            else if (thisResizer.classList.contains('nw')){
                resizerMoveDx -= resizerMoveX
                resizerMoveDx = Math.min(
                    Math.max(resizerMoveDx, (-RectInitialWidth + thisResizer.clientWidth)), (boundRect.width - (RectInitialWidth))
                );
                moveX += resizerMoveX/2
                moveX = Math.min(
                    Math.max(moveX, (wrapperLeft - contentInitialLeft + resizerMoveDx/2)), (wrapperRight - contentInitialRight - resizerMoveDx/2)
                );
                content.style.width = `${RectInitialWidth + resizerMoveDx}px`;
                resizerMoveDy -= resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop+ resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
            }


            else if (thisResizer.classList.contains('n')){
                resizerMoveDy -= resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop+ resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;
            }


            else if (thisResizer.classList.contains('ne')){
                resizerMoveDy -= resizerMoveY
                resizerMoveDy = Math.min(
                    Math.max(resizerMoveDy, (-RectInitialHeight + thisResizer.clientWidth)), ((rectMaxBottom-rectMaxTop) - (RectInitialHeight))
                );
                moveY += resizerMoveY/2
                moveY = Math.min(
                    Math.max(moveY, (rectMaxTop - contentInitialTop+ resizerMoveDy/2)), (rectMaxBottom - contentInitialBottom - resizerMoveDy/2)
                );
                content.style.height = `${RectInitialHeight + resizerMoveDy}px`;

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

