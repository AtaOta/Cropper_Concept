let ImageWrapper = document.querySelector('.Moveble_Image_Wrapper');
let imgWrapperRect = ImageWrapper.getBoundingClientRect();

let Mover_Wrapper = document.querySelector('.Mover_Wrapper');
let boundRect = Mover_Wrapper.getBoundingClientRect();

let content = document.querySelector('.Content');
let rect = content.getBoundingClientRect();


let scroll_height = 0;
let scroll_widht = 0;
let imgTouchX, imgTouchY, imgMoveX = 0, imgMoveY = 0, scale = 1; 
let touchX, touchY, moveX = 0, moveY = 0;

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




ImageWrapper.addEventListener('mousedown', imgMousedown);

function imgMousedown(e){
    e.preventDefault();
    ImageMove = true;

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
        ImageWrapperTop = imgWrapperRect.top - scroll_height;
      
        contenFinalBottom = rect.bottom - scroll_height - moveY;
        contentFinalTop = rect.top - scroll_height - moveY;

        imgMoveX = Math.min(
            Math.max(imgMoveX, (wrapperRight - ImageWrapperRight)), (wrapperLeft - ImageWrapperLeft)
        );
        
        imgMoveY = Math.min(
            Math.max(imgMoveY, (ImageWrapperTop - contentFinalTop)), (ImageWrapperBottom - contenFinalBottom)
        );

        ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scale})`;
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
        moveX = e.clientX - touchX;
        moveY = e.clientY - touchY;

        let rectMaxTop = ((imgWrapperRect.top + imgMoveY) <= (wrapperTop)) ? (wrapperTop):(imgWrapperRect.top + imgMoveY);
        
        let rectMaxBottom = ((imgWrapperRect.bottom + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom):(imgWrapperRect.bottom + imgMoveY);

        moveX = Math.min(
            Math.max(moveX, (wrapperLeft - contentInitialLeft)), (wrapperRight - contentInitialRight)
        );
        
        moveY = Math.min(
            Math.max(moveY, (rectMaxTop - contentInitialTop)), (rectMaxBottom - contentInitialBottom)
        );

        content.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    function mouseup(){
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }

}



