# TypeScriptRunner

这是一款TypeScript，和JavaScript解析器，

可以直接运行脚本，

可用于TypeScript或JavaScript项目的热更新，或者脚本动态解析。


This is a TypeScript and JavaScript parser,

You can run the script directly,

Can be used for hot updates to TypeScript or JavaScript projects, or for script parsing. 





[code]

<script src="dmxts.min.js"></script>
<script>    
    console.log('hello');    
    dmt.TsCode.Run(`console.log('hello');`, window);    
</script>

[/code]


作者花了1个月的时间写出来，并进行了大量的测试，可以达到95%以上的解析率，现在贡献出来。
效率上无法和原生运行相比，不适合整个项目的直接运行，但适用于局部解析，或者部分功能解析。
非常适合在一些无法使用eval的场景中使用。

The author spent a month to write it, and carried out a lot of tests, can reach more than 95% of the resolution rate.

The efficiency is not as good as that of native operation. It is not suitable for direct operation of the whole project, but it is suitable for partial parsing, or partial functional parsing.

This is ideal for use in situations where eval is not possible.


iksu@163.com
微信：cn54web
