var images = {};

var filesPreview = $('.image-list');

// canvas
var canvas = $('.canvastool')[0];
var ctx = canvas.getContext('2d');

var fcanvas = $('.canvasfinal')[0];
var fctx = fcanvas.getContext('2d');

// button
$('#uploadbtn').on('click', function(){
    $('#uploadfile').click();
});
$('#clearbtn').on('click', function(){
    images = {};
    updateFiles();
});
// export img
$('#exportbtn').on('click', function(){
    var download = document.getElementById("download");
    var image = fcanvas.toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);

    $('#buttontoclick').click();
});
// event delete 
$('body').on('click', '.btn-delete', function(){
    let id = $(this).data('id');
    let parent = $(this).parent();

    delete images[id];

    console.log('delete id : ',id);
    
    parent.remove();

    updateFiles();
});
// event change
$('#uploadfile').on('change', function(e){
    for(var i in e.target.files){
        let f = e.target.files[i];

        if ((f.type+"").indexOf('image') > -1)
            images[Object.keys(images).length] = {file : f, img : new Image(f.file)};
    }

    setTimeout(function(){
        $('#uploadfile').val('');
    }, 1000);

    updateFiles();
});
// config inputs change : update
$('input').on('change', function(){
    updateCanvas();
});

// docuemnt ready
$(document).ready(function(){
    updateCanvasSize();
    updateFiles();
});
// window resize
$(window).resize(function(){
    updateCanvasSize();
    updateFiles();
});

/**
 * Functions
 */
var updateCanvasSize = ()=>{
    canvas.width = $('.col-canvas').width()*0.999;
    canvas.height = $('.col-canvas').height()*0.999;
}

var updateFiles = function (){

    let new_tpl = $('<ul></ul>');
    let x = 0;
    let nimages = {};
    for(var i in images){
        let f = images[i];

        let li = $('<li></li>');
        li.append('<img class=img'+x+' src=""> '+f.file.name+' <button data-id="'+x+'" class="mt-2 float-right text-danger btn btn-sm btn-delete"><i class="fa fa-trash"></i></button> ');
      
        var reader = new FileReader();

        (function(filesPreview,reader , x){ 
            // console.log('Load : ',x);
            reader.onload =  (e)  =>{
                let simg = filesPreview.find('.img'+x);
                simg.attr('src', e.target.result);
                images[x].img = simg[0];
                updateCanvas();
            }
        })(filesPreview,reader , x);

        new_tpl.append(li);
        reader.readAsDataURL(f.file);

        nimages[x] = f;
        x++;
    }
    images = nimages;


    filesPreview.html(new_tpl.html());
    setTimeout(()=>{
        updateCanvas();
    },1000);
}


var updateCanvas = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let items = getClcItems();

    for(var i in items){
        let item = items[i];

        ctx.drawImage(item.img, item.x,item.y);
        fctx.drawImage(item.img, item.x,item.y);
    }

}

var getClcItems = ()=>{
    var c = getConfigs();
    var row = [];
    var allrows = [];
    var fitems = [];
    let x =0 , y = 0 , sx = 0 , sy = 0;
    let bigx =0 , bigy = 0;

    fctx.clearRect(0,0,canvas.width,canvas.height);
  
    for(var i in images){
        let img = images[i];
        
        x = (img.img.height  + c.padding ) * (row.length);
        y = (img.img.width  + c.padding ) * (allrows.length);
        sx = x + img.img.width;
        sy = y + img.img.height;


        let item = {img : img.img , x : x , y : y , sx : sx , sy:sy};

        row.push(item);
        fitems.push(item);


        
        if (sx>bigx) bigx=sx;
        if (sy>bigy) bigy=sy;

        if (row.length >= c.cols)
        {
            allrows.push(row);
            row =[];
        }
        
    }

    fcanvas.width = bigx;
    fcanvas.height = bigy;

    return fitems;
}


var getConfigs = ()=>{
    let cols = parseInt($('#cols').val());
    let rows = parseInt($('#rows').val());
    let padding = parseInt($('#padding').val());

    return {
        padding : padding ? padding : 0,
        rows : rows ? rows : Infinity,
        cols : cols ? cols : 0
    }
}