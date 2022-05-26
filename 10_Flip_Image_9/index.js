let Mover_Wrapper = document.querySelector('.Mover_Wrapper');
let boundRect = Mover_Wrapper.getBoundingClientRect();

let ImageWrapper = document.querySelector('.Moveble_Image_Wrapper');
let leImg = ImageWrapper.firstElementChild;
ImageWrapper.style.width = `${boundRect.width}px`;
ImageWrapper.style.height = `auto`;
leImg.style.width = `100%`;
leImg.style.height = `auto`;
let imgWrapperRect = ImageWrapper.getBoundingClientRect();
let leImgRect = leImg.getBoundingClientRect();
let imageNaturalWidth = leImg.naturalWidth;
let imageNaturalHeight = leImg.naturalHeight;
let imgAspectRatio = (imageNaturalWidth/imageNaturalHeight);

let content = document.querySelector('.Content');
let RectInitialWidth = 100, RectInitialHeight = 100;
const InitializeCropper = () =>{
    content.style.height = `${RectInitialHeight}px`;
    content.style.width = `${RectInitialWidth}px`;
}
InitializeCropper();
let rect = content.getBoundingClientRect();

let resizers = document.querySelectorAll('.mover')
let RotorRight = document.querySelector('#RotateRight');
let RotorLeft = document.querySelector('#RotateLeft');
let increaseImageSize = document.querySelector('#Increase_img_Size');
let decreaseImageSize = document.querySelector('#Decrease_img_Size');
let flipVartical = document.querySelector('#Flip_Vartical');
let flipHorizontal = document.querySelector('#Flip_Horaizontal');


let rotate = 0, heightChange = 0, widthChange = 0, zoomingHeightChange = 0, zoomingWidthChange = 0;
let scroll_height = 0;
let scroll_widht = 0;
let imgTouchX, imgTouchY, imgMoveX = 0, imgMoveY = 0, scale = 1, scaleY = 1, scaleX = 1; 
let touchX, touchY, moveX = 0, moveY = 0, touchDx = 0, touchDy = 0;
let resizerTouchX, resizerTouchY, resizerMoveX = 0, resizerMoveDx = 0, resizerMoveY = 0, resizerMoveDy = 0;


window.addEventListener('scroll', ()=>{
    scroll_height = document.documentElement.scrollTop;
    scroll_widht = document.documentElement.scrollLeft;
})
let IsResizing = false;



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



/* =================================================================================================================*/
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
      
        contenFinalBottom = rect.bottom - scroll_height - moveY + resizerMoveDy/2;
        contentFinalTop = rect.top - scroll_height - moveY - resizerMoveDy/2;

        imgMoveY = Math.min(
            Math.max(imgMoveY, (ImageWrapperTop - contentFinalTop + heightChange/2 + zoomingHeightChange/2)), (ImageWrapperBottom - contenFinalBottom - heightChange/2 - zoomingHeightChange/2)
        );
        imgMoveX = Math.min(
            Math.max(imgMoveX, (wrapperRight - ImageWrapperRight + zoomingWidthChange/2)), (wrapperLeft - ImageWrapperLeft - zoomingWidthChange/2)
        );
        ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
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
            
            rectMaxTop = ((imgWrapperRect.top + heightChange/2 + zoomingHeightChange/2 + imgMoveY) <= (wrapperTop)) ? (wrapperTop) : (imgWrapperRect.top + heightChange/2 + zoomingHeightChange/2 + imgMoveY);

            rectMaxBottom = ((imgWrapperRect.bottom - heightChange/2 + zoomingHeightChange/2 + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom) : (imgWrapperRect.bottom - heightChange/2 - zoomingHeightChange/2 + imgMoveY);

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
            

            rectMaxTop = ((imgWrapperRect.top + heightChange/2 + zoomingHeightChange/2 + imgMoveY) <= (wrapperTop)) ? (wrapperTop):(imgWrapperRect.top + heightChange/2 + zoomingHeightChange/2 + imgMoveY);
            
            rectMaxBottom = ((imgWrapperRect.bottom - heightChange/2 - zoomingHeightChange/2 + imgMoveY) >= (wrapperBottom)) ? (wrapperBottom):(imgWrapperRect.bottom - heightChange/2 - zoomingHeightChange/2 + imgMoveY);
            
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


/* =================================================[IMAGE ROTATE ]================================================================*/
const WidthAndHeightChange = () =>{
    InitializeCropper();
    ImageWrapper.style.height = `${boundRect.width}px`;
    ImageWrapper.style.width = `auto`;
    leImg.style.height = `100%`;
    leImg.style.width = `auto`;
    let preVheight = (boundRect.width*imageNaturalHeight)/imageNaturalWidth
    let newHeight = (boundRect.width*imageNaturalWidth)/imageNaturalHeight
    heightChange = (preVheight - newHeight)

    zoomingHeightChange = 0, zoomingWidthChange = 0;
    imgTouchX, imgTouchY, imgMoveX = 0, imgMoveY = 0, scale = 1, touchX, touchY, moveX = 0, moveY = 0, touchDx = 0, touchDy = 0, resizerTouchX, resizerTouchY, resizerMoveX = 0, resizerMoveDx = 0, resizerMoveY = 0, resizerMoveDy = 0;
}

const ImageInitialize = () =>{
    InitializeCropper();
    ImageWrapper.style.height = `auto`;
    ImageWrapper.style.width = `${boundRect.width}px`;
    leImg.style.height = `auto`;
    leImg.style.width = `100%`;

    heightChange = 0, widthChange = 0, zoomingHeightChange = 0, zoomingWidthChange = 0;
    imgTouchX, imgTouchY, imgMoveX = 0, imgMoveY = 0, scaleX = 1, scaleY = 1, touchX, touchY, moveX = 0, moveY = 0, touchDx = 0, touchDy = 0, resizerTouchX, resizerTouchY, resizerMoveX = 0, resizerMoveDx = 0, resizerMoveY = 0, resizerMoveDy = 0;
}

const DetetctRotate = () =>{
    if (rotate == 0){
        ImageInitialize();
        PositioningCropper();
    }
    
    if (rotate == 90 || rotate == -90){
        WidthAndHeightChange();
        PositioningCropper();
    }
    if (rotate == 180 || rotate == -180){
        ImageInitialize();
        PositioningCropper();
    }
    if (rotate == 270 || rotate == -270){
        WidthAndHeightChange();
        PositioningCropper();
    }
    ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
}

RotorRight.addEventListener('click', ()=>{
    rotate += 90
    if (rotate == 360){
        rotate = 0;
    }
    DetetctRotate();
})

RotorLeft.addEventListener('click', ()=>{
    rotate -= 90
    if (rotate == -360){
        rotate = 0;
    }
    DetetctRotate();
})

/* =================================================================================================================*/


/* ==========================================[ SCALE IMAGE ]=======================================*/
const HeightWidthChangeOnScale = () =>{
    let preVheight = (boundRect.width*imageNaturalHeight)/imageNaturalWidth
    let neWheight = imgWrapperRect.height*scaleX
    zoomingHeightChange = (preVheight - neWheight)

    let preVwidth = boundRect.width
    let neWwidth = boundRect.width*scaleX
    zoomingWidthChange = (preVwidth - neWwidth)
    ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
}
increaseImageSize.addEventListener('click', ()=>{
    if(scaleX<2.5 && scaleY<2.5 && scaleX>0 && scaleY>0){
        scaleX += 0.1;
        scaleY += 0.1;
        HeightWidthChangeOnScale();
    }
    else if(scaleX<0 || scaleY<0){
        scaleX = 1;
        scaleY = 1;
        HeightWidthChangeOnScale();
    }
})
decreaseImageSize.addEventListener('click', ()=>{
    if(scaleX > 1 && scaleY > 1){
        scaleX -= 0.1;
        scaleY -= 0.1;
        HeightWidthChangeOnScale();
    }
})

/* ==========================================[ FLIP IMAGE ]=======================================*/
flipVartical.addEventListener('click', ()=>{
    heightChange = 0, widthChange = 0, zoomingHeightChange = 0, zoomingWidthChange = 0;
    if (scaleY >= 1 && scaleX <=1){
        scaleY = -1
    }
    else if(scaleY >= 1 && scaleX >=1){
        scaleY = -1
        scaleX = 1
    }
    else if(scaleY == -1){
        scaleY = 1
    }
    ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
})
flipHorizontal.addEventListener('click', ()=>{
    heightChange = 0, widthChange = 0, zoomingHeightChange = 0, zoomingWidthChange = 0;
    if (scaleX >= 1 && scaleY <=1){
        scaleX = -1
    }
    else if(scaleX >= 1 && scaleY >=1){
        scaleX = -1
        scaleY = 1
    }
    else if(scaleX == -1){
        scaleX = 1
    }
    ImageWrapper.style.transform = `translate(${imgMoveX}px, ${imgMoveY}px) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`;
})