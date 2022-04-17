$(function() {
    // 1. 定义延时器的Id
    var timer = null
        // 定义全局缓存对象
    var cacheObj = {}

    // 2. 定义防抖的函数
    function debounceSearch(kw) {
        timer = setTimeout(function() {
            getSuggestList(kw)
        }, 500)
    }

    // 为输入框绑定 keyup 事件
    $('#ipt').on('keyup', function(e) {
            // 3. 清空 timer
            clearTimeout(timer)
            var keywords = $(this).val().trim()
            if (keywords.length <= 0) {
                return $('#suggest-list').empty().hide()
            }
            if (e.keyCode === 13) {
                $('.btnSearch').click()
            }
            // 先判断缓存中是否有数据
            if (cacheObj[keywords]) {
                return renderSuggestList(cacheObj[keywords])
            }

            // TODO:获取搜索建议列表
            // console.log(keywords)
            // getSuggestList(keywords)
            debounceSearch(keywords)
        })
        //获取焦点也渲染数据
    $('#ipt').on('focus', function() {
        $(this).css('width', '500px')
            // 3. 清空 timer
        clearTimeout(timer)
        var keywords = $(this).val().trim()
        if (keywords.length <= 0) {
            return $('#suggest-list').empty().hide()
        }


        // 先判断缓存中是否有数据
        if (cacheObj[keywords]) {
            return renderSuggestList(cacheObj[keywords])
        }

        // TODO:获取搜索建议列表
        // console.log(keywords)
        // getSuggestList(keywords)
        debounceSearch(keywords)
    })


    function getSuggestList(kw) {
        $.ajax({
            url: 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=36178,36020,35912,36166,34584,36120,36073,36125,36296,36232,26350,36103,36061&wd=' + kw + '&req=2&csor=4&pwd=123',
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function(res) {
                // console.log(res)
                renderSuggestList(res)
            }
        })
    }

    // 渲染UI结构
    function renderSuggestList(res) {
        if (res.g.length <= 0) {
            return $('#suggest-list').empty().hide()
        }
        var htmlStr = template('tpl-suggestList', res)
        $('#suggest-list').html(htmlStr).show()

        // 1. 获取到用户输入的内容，当做键
        var k = $('#ipt').val().trim()
            // 2. 需要将数据作为值，进行缓存
        cacheObj[k] = res
    }

    //绑定点击事件
    $('#suggest-list').on('click', 'div', function() {
        console.log($(this).text());
        var url = 'https://www.baidu.com/s?wd=' + $(this).text()
        window.location.href = url
    })
    $('.btnSearch').on('click', function() {
            if ($('#ipt').val().trim() == '') return

            var url = 'https://www.baidu.com/s?wd=' + $('#ipt').val().trim()
            $('#ipt').val('')
            window.location.href = url

        })
        // 失去焦点隐藏
    $('#ipt').on('blur', function() {
        setTimeout(function() {
            $('#ipt').css('width', '34px')
            $('#ipt').val('')
            $('#suggest-list').empty().hide()
        }, 200)
    })
    $('#ipt').on('mouseenter', function() {
        $('#ipt').css('width', '500px')
    })

})