$(".nav-tabs li").click(function(index){
    $(this).addClass("active")
        .siblings().removeClass("active").end()
        .parent().next().children(".row-fluid")
        .eq($(this).index()).show()
        .siblings().hide();
});