const $=require("jquery");
const LEFT_BOARD_WIDTH=300;
function reset_rightboard_width(){
    var wwidth = window.innerWidth;
    var right_board_width = wwidth - LEFT_BOARD_WIDTH;
    var center_board_width = right_board_width - 20;

    if(center_board_width > 1280){
    center_board_width = 1280;
    }
    if(center_board_width > 800){
    $(".center_main").css("width",center_board_width);
    $(".center_main").css("margin-left","calc(50% - "+center_board_width/2+"px)")
    }
    var left_board_expand = true;
    $("#left_close_btn").on("click",function(){
        if(left_board_expand){
            $("#left_board").css("width", 80);
            $("#right_board").css("width", "calc(100% - 80px)");
            $("#left_board .li .title").css("width", 0);
            this.innerHTML="&#xe62d;";
            left_board_expand = false;
            return;
        }

        $("#left_board").css("width", LEFT_BOARD_WIDTH);
        $("#right_board").css("width", "calc(100% - 300px)");

        $("#left_board .li .title").css("width", "calc(100% - 100px)");
        this.innerHTML="&#xe62c;";
        left_board_expand = true;
    return;
    })
}
// $(".center_main").css("width","90%");
// $(".center_main").css("margin-left","5%");




// $(".msgBox .close_btn").on("click",function(){
// $(this).parent().css("display", "none");
// })

// $(".msgBox .cancel_btn").on("click",function(){
// var parents = $(this).parents();
// for(let i = 0; i < parents.length;i ++){
//     if($(parents[i]).is(".msgBox")){
//         $(parents[i]).css("display","none");
//         return;
//     }
// }
// })

export default{
    "reset_rightboard_width":reset_rightboard_width,
}

