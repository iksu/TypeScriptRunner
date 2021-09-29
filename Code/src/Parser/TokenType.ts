namespace dmt {
    //ExpressCheckType
    export enum ECT {
        /*
        * 验证失败，需要检验下一个Express
        */
        Fail,
        /*
        * 验证通过
        */
        OK,
        /*
        * 验证失败，但是继续检测该Express，这个值要删掉和OKAndStay冲突，但意义不明
        */
        /*
        * 验证通过 但是epress不递增，继续验证当前epress
        */
        OKStay,
        /*
        * 验证通过 但是跳过该Token
        */
        OKSkip,
        /*
        * 验证通过 但是跳过该Token，并且epress不递增，继续验证当前epress
        */
        OKSkipStay
    }

    //TokenType
    export enum KT {
        /**
         * 空类型（没有实际用途）		
         */
        None,
        /*
        *  reservedWord
        */
        ReservedWord,
        /**
         * var		
         */
        Var,
        /**
         * let		
         */
        Let,
        /**
         * const		
         */
        Const,
        /**
         * {}
         */
        Brace,
        /**
         * {		
         */
        LeftBrace,
        /**
         * }		
         */
        RightBrace,
        /**
         * ()		
         */
        Par,
        /**
         * (		
         */
        LeftPar,
        /**
         * )		
         */
        RightPar,
        /**
         * []	
         */
        Bracket,
        /**
         * [		
         */
        LeftBracket,
        /**
         * ]		
         */
        RightBracket,
        /**
         * <>	
         */
        AngleBracket,
        // /**
        //  * <这个是小于		
        //  */
        // LeftAngleBracket,
        // /**
        //  * >这个是大于		
        //  */
        // RightAngleBracket,
        /**
         * .		
         */
        Period,
        PeriodVal,
        PeriodKeyVal,
        /**
         * ,
         */
        Comma,
        /**
         * :
         */
        Colon,
        /**
         * :
         */
        ColonVal,
        /**
         * ;		
         */
        SemiColon,
        /**
         * ?		
         */
        QuestionMark,
        /**
         * +		
         */
        Plus,
        /**
         * +...
         */
        UnaryPlus,
        /**
         * ++		
         */
        Increment,
        /**
         * ++...
         */
        UnaryIncrement,
        /**
         * +=		
         */
        AssignPlus,
        /**
         * -		
         */
        Minus,
        /**
         * -...
         */
        UnaryMinus,
        /**
         * --		
         */
        Decrement,
        /**
         * --...
         */
        UnaryDecrement,
        /**
         * -=		
         */
        AssignMinus,
        /**
         * *		
         */
        Multiply,
        /**
         * *=		
         */
        AssignMultiply,
        /**
         * /		
         */
        Divide,
        /**
         * /=		
         */
        AssignDivide,
        /**
         * **
         */
        Exponentiation,
        /**
         * % 模运算		
         */
        Modulo,
        /**
         * %=		
         */
        AssignModulo,
        /**
         * | 或运算		
         */
        InclusiveOr,
        /**
         * |=		
         */
        AssignInclusiveOr,
        /**
         * ||		
         */
        Or,
        /**
         * & 并运算		
         */
        Combine,
        /**
         * &=		
         */
        AssignCombine,
        /**
         * &&		
         */
        And,
        /**
         * ^ 异或		
         */
        XOR,
        /**
         * ^=		
         */
        AssignXOR,
        /**
         * <<左移		
         */
        Shi,
        /**
         * <<=		
         */
        AssignShi,
        /**
         * >> 右移		
         */
        Shr,
        /**
        * >>> 无符号右移		
        */
        UnsignedShr,
        /**
         * >>=		
         */
        AssignShr,
        /**
        * >>>=		
        */
        AssignUnsignedShr,
        /**
         * !		
         */
        Not,
        /**
         * ~
         */
        BitwiseNot,
        /**
         * =		
         */
        Assign,
        /**
         * ==		
         */
        Equal,
        /**
         * ===		
         */
        AllEqual,
        /**
         * instanceof
         */
        Instanceof,
        /**
         * typeof
         */
        Typeof,
        /**
         * !=		
         */
        NotEqual,
        /**
         * !==		
         */
        AllNotEqual,
        /**
         * >		
         */
        Greater,
        /**
         * >=		
         */
        GreaterOrEqual,
        /**
         *  <		
         */
        Less,
        /**
         * <=		
         */
        LessOrEqual,
        /**
         * ..
         */
        ParamsPre,
        /**
         * ...
         */
        Params,
        /**
         * if		
         */
        If,
        /**
         * if
         */
        IfVal,
        /**
         * else		
         */
        Else,
        /**
         * else	if	
         */
        ElseIf,
        /**
         * for		
         */
        For,
        /**
         * dynamic		
         */
        //Dynamic,
        // /**
        //  * each		
        //  */
        // Each,
        // forEach map filter every some
        /**
         * in		
         */
        In,
        /**
         * switch		
         */
        Switch,
        /**
         * case		
         */
        Case,
        CaseVal,
        /**
         * default		
         */
        Default,
        DefaultVal,
        /**
         * break		
         */
        Break,
        /**
         * continue		
         */
        Continue,
        /**
         * return		
         */
        Return,
        /**
         * while		
         */
        While,
        /**
         * function		
         */
        Function,
        /**
         * try		
         */
        Try,
        TryVal,
        /**
         * catch		
         */
        Catch,
        /**
         * throw		
         */
        Throw,
        /**
         * boolean
         */
        Boolean,
        /**
         * bool true false		
         */
        BooleanVal,
        /**
         * true		
         */
        True,
        /**
         * false		
         */
        False,
        /**
         * int float		
         */
        Number,
        /**
         * int float		
         */
        NumberVal,
        /**
         * string		
         */
        String,
        /**
        * string
        */
        StringVal,
        /**
         * null		
         */
        Null,
        /**
         * export
         */
        Export,
        /**
         * abstract
         */
        Abstract,
        /**
         * 名称空间定义（暂时当作模块来使用）
         */
        NameSpace,
        /**
         * 模块定义		
         */
        Module,
        /**
         * 类定义		
         */
        Class,
        ClassInstance,
        PreConstructor,
        /**
         * 接口定义		
         */
        Interface,
        InterfaceInstance,
        /**
         * 公共		
         */
        Public,
        /**
         * 保护		
         */
        Protected,
        /**
         * 私有		
         */
        Private,
        /**
         * 继承		
         */
        Extends,
        /**
         * 静态		
         */
        Static,
        /**
         * 实例		
         */
        New,
        /**
         * undefined or null
         */
        Void,
        /**
         * any
         */
        Any,
        /**
         * never
         */
        Never,
        /**
         * 是window下的一个值，不是关键词
         */
        NaN,
        /**
        * 是window下的一个值，不是关键词
        */
        Undefined,
        Async,
        Await,
        /**
         * 引入		
         */
        Import,
        /**
         * get		
         */
        Get,
        /**
         * set		
         */
        Set,
        /**
         * as
         */
        As,
        /**
         * delete
         */
        Delete,
        /**
         * implements
         */
        Implements,
        /*
        * //...
        */
        Annotation,
        /*
        * /*...*\/
        */
        AnnotationStar,
        /*
        *...(...)
        */
        Call,
        /*
        *...(...)
        */
        //CallVal,
        /*
        *....(...)
        */
        //CallValPeriod,
        /*
        * \n
        */
        Enter,
        /**
         * =>
         */
        FunctionSymbol,
        /**
         * function(){}
         */
        FunctionAnonymous,
        /*
        * 外部标记
        */
        Customize,
        /*
        * this
        */
        This,
        /*
        * super
        */
        Super,
        /*
        * 结束标记
        */
        End,
        /*
        * 任意一个
        */
        AnyOne,
        /*
        * yield(非标准)
        */
        Yield,
        /*
        * yield*(非标准)
        */
        YieldStar,
        Json,
        JsonVal,
        Declare,
        /*
        * /.../g
        */
        RegExpVal,
    }
}