const MainTokens = {
	//{{ Whitespace Tokens }}\\
    "TK_W1":{v:" ",t:"Whitespace"},
    "TK_W2":{v:String.fromCharCode(9),t:"Whitespace"},
    "TK_W3":{v:String.fromCharCode(10),t:"Whitespace"},
    "TK_W4":{v:String.fromCharCode(11),t:"Whitespace"},
    "TK_W5":{v:String.fromCharCode(12),t:"Whitespace"},
    "TK_W6":{v:String.fromCharCode(13),t:"Whitespace"},
    "TK_W7":{v:String.fromCharCode(133),t:"Whitespace"},
	//{{ Operator Tokens }}\\
	"TK_ADD":{v:"+",t:"Operator"},
    "TK_SUB":{v:"-",t:"Operator"},
    "TK_MUL":{v:"*",t:"Operator"},
    "TK_DIV":{v:"/",t:"Operator"},
    "TK_MOD":{v:"%",t:"Operator"},
    "TK_POW":{v:"^",t:"Operator"},
    "TK_IF":{v:"?",t:"Operator"},
    "TK_DOT":{v:".",t:"Operator"},
    "TK_LINEEND":{v:";",t:"Operator"},
    "TK_COMMA":{v:",",t:"Operator"},
    "TK_EQ":{v:"=",t:"Operator"},
    "TK_COLON":{v:":",t:"Operator"},
    "TK_LT":{v:"<",t:"Operator"},
    "TK_GT":{v:">",t:"Operator"},
    "TK_AT":{v:"@",t:"Operator"},
    "TK_AND":{v:"&",t:"Operator"},
    "TK_OR":{v:"|",t:"Operator"},
    "TK_NOT":{v:"!",t:"Operator"},
    "TK_FUNC":{v:"#",t:"Operator"},
    "TK_LOOP":{v:"~",t:"Operator"},
    "TK_WHILE":{v:"$",t:"Operator"},
    "TK_EQRA":{v:"⇒",t:"Operator"},
    "TK_EQLA":{v:"⇐",t:"Operator"},
    "TK_DSRA":{v:"»",t:"Operator"},
    "TK_SRA":{v:"›",t:"Operator"},
    "TK_SLA":{v:"‹",t:"Operator"},
    "TK_SELFCALL":{v:"↦",t:"Operator"},
    //{{ String Tokens }}\\
    "TK_QUOTE":{v:"\"",t:"String"},
    //{{ N-String Tokens }}\\
    "TK_APOS":{v:"'",t:"Number"},
    //{{ V-String Tokens }}\\
    "TK_GRAVE":{v:"`",t:"Variable"},
    //{{ Control Tokens }}\\
    "TK_BACKSLASH":{v:"\\",t:"Control"},
    //{{ Bracket Tokens }}\\
    "TK_BOPEN":{v:"{",t:"Bracket"},
    "TK_BCLOSE":{v:"}",t:"Bracket"},
    "TK_POPEN":{v:"(",t:"Bracket"},
    "TK_PCLOSE":{v:")",t:"Bracket"},
    "TK_IOPEN":{v:"[",t:"Bracket"},
    "TK_ICLOSE":{v:"]",t:"Bracket"},
   	//{{ Boolean Token }}\\
    "TK_TRUE":{v:"T",t:"Boolean"},
    "TK_FALSE":{v:"F",t:"Boolean"},
    //{{ Null Token }}\\
    "TK_NULL":{v:"U",t:"Null"},
    //{{ Base Token }}\\
    //"TK_":{v:"",t:""},
}

function GetTokenName(Value){
	for(let k in MainTokens){
    	let v=MainTokens[k];
        if(v.v==Value)return k;
    }
    return Value;
}

function GetTokenType(Value){
	for(let k in MainTokens){
    	let v=MainTokens[k];
        if(v.v==Value)return v.t;
    }
    return "Identifier";
}

const IsToken=(t,v,ty)=>{
	if(!t){return false}return t.Value==v&&t.Type==ty;
}

const IsType=(t,ty)=>{
	if(!t){return false}return t.Type==ty;
}

const Between=o=>{
	let b=[];
    let{s,Start:st,End:en,Escape:ec,Tokens:tks}=o;
    let tl=tks.length-1;
    s.i++;
    while(!IsToken(tks[s.i],en.Value,en.Type)){
    	let t=tks[s.i];
        if(IsToken(t,ec.Value,ec.Type))s.i++,t=tks[s.i];
        b.push(t),s.i++;
    	if(s.i>tl)break;
    }
    return b;
}

const Tokenize = Code=>{
	let Tokens=Code.split("");
    let i=0,tl=Tokens.length-1;
    while(i<=tl){
    	let t=Tokens[i];
        Tokens[i]={Value:GetTokenName(t),Type:GetTokenType(t),RawValue:t,toString:function(){let n=[];for(let k in this){if(k=="toString"){continue}n.push(`${k}: ${this[k]}`)}return`{${n.join(", ")}}`}};
    	i++;
    }
    let s={i:0},NewTokens=[];
    while(s.i<=tl){
    	let t = Tokens[s.i];
        if(IsType(t,"String")){
        	let b = Between({s:s,Start:{Value:t.Value,Type:t.Type},End:{Value:t.Value,Type:t.Type},Escape:{Value:"TK_BACKSLASH",Type:"Control"},Tokens:Tokens});
            t.Type="Constant",t.Value=b.map(x=>x.RawValue).join(""),t.RawValue="String";
        }else if(IsType(t,"Number")){
        	let b = Between({s:s,Start:{Value:t.Value,Type:t.Type},End:{Value:t.Value,Type:t.Type},Escape:{Value:"TK_BACKSLASH",Type:"Control"},Tokens:Tokens});
            t.Type="Constant",t.Value=+b.map(x=>x.RawValue).join(""),t.RawValue="Number";
       	}else if(IsType(t,"Variable")){
        	let b = Between({s:s,Start:{Value:t.Value,Type:t.Type},End:{Value:t.Value,Type:t.Type},Escape:{Value:"TK_BACKSLASH",Type:"Control"},Tokens:Tokens});
            t.Type="Identifier",t.Value=b.map(x=>x.RawValue).join(""),t.RawValue=t.Value;
        }else if(IsType(t,"Whitespace")){
        	s.i++;
            continue;
        }else if(IsType(t,"Boolean")){
        	t.Type="Constant";
            t.Value=t.Value=="TK_TRUE"?true:false;
            t.RawValue="Boolean";
        }
        else if(IsType(t,"Boolean")){
        	t.Type="Constant";
            t.Value=null;
            t.RawValue="Null";
        }
        NewTokens.push(t);
    	s.i++;
    }
    return NewTokens;
}

class ASTBase {
	constructor(Type){
    	this.Type = Type;
    }
    toString(){let n=[];for(let k in this){if(k=="toString"){continue}n.push(`${k}: ${this[k]}`)}return`{${n.join(", ")}}`}
}

class ASTBlock extends ASTBase {
	constructor(Type="Block"){
    	super(Type);
        this.Data=[];
        this.Data.toString=function(){let n=[];for(let k in this){if(k=="toString"){continue}n.push(`${this[k]}`)}return`[${n.join(", ")}]`}
    }
    Write(Value){
    	this.Data.push(Value);
    }
    Read(Value){
    	return this.Data[Value];
    }
    get length(){
    	return this.Data.length;
    }
}

class ASTNode extends ASTBase {
	constructor(Type="Node"){
    	super(Type);
        this.Data={};
        this.Data.toString=function(){let n=[];for(let k in this){if(k=="toString"){continue}n.push(`${k}: ${this[k]}`)}return`{${n.join(", ")}}`}
    }
    Write(Name,Value){
    	this.Data[Name]=Value;
    }
    Read(Name){
    	return this.Data[Name];
    }
}

class ASTExpression {
	constructor(Value,Priority){
    	this.Value=Value;
        this.Priority=Priority;
    }	
}

const AST=Tokens=>{
	let Stack = {
    	Tokens:Tokens,
        Position:0,
        Token:Tokens[0],
        IsEnd:function(){
        	return this.Position>=this.Tokens.length;
        },
        Next:function(Amount=1){
        	this.Position+=Amount;
            this.Token=this.Tokens[this.Position];
            return this.Token;
        },
        Result:new ASTBlock("Block"),
        OpenChunks:[],
        OpenChunk:function(){
        	this.OpenChunks.push(this.Chunk);
            this.Chunk = this.NewBlock();
        },
        ChunkWrite:function(Value){
        	this.Chunk.Write(Value);
        },
        CloseChunk:function(){
        	if(this.OpenChunks.length>0){
            	let Previous = Stack.Chunk;
                Stack.Chunk = Stack.OpenChunks.pop();
                Stack.Chunk.Write(Previous);
            }
        },
        NewBlock:function(){
        	return new ASTBlock("Block");
        },
        NewNode:function(Type="Node"){
        	return new ASTNode(Type);
        },
        CheckNext:function(Value,Type){
        	return IsToken(this.Tokens[this.Position+1],Value,Type);
        },
        TestNext:function(Value,Type){
        	if(!this.CheckNext(Value,Type)){
            	throw Error(`Expected ${MainTokens[Value].v}, got ${this.Token?this.Token.RawValue:"<EOS>"}`);
            }
        },
        ComplexExpressionStates:[
        	{
            	Value:"TK_SUB",
                Type:"Operator",
                Priority:300,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Sub");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_ADD",
                Type:"Operator",
                Priority:320,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Add");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_DIV",
                Type:"Operator",
                Priority:340,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Div");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_MOD",
                Type:"Operator",
                Priority:340,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Mod");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_MUL",
                Type:"Operator",
                Priority:360,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Mul");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_POW",
                Type:"Operator",
                Priority:380,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Pow");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_DOT",
                Type:"Operator",
                Priority:700,
                Call:function(Value,Priority){
                    let Index = this.Next(2);
                    if(Index.Type!="Identifier"&&Index.Type!="Constant"){
                    	throw Error(`${Index.RawValue} is not a valid index name`);
                    }
                    Index=Index.Value;
                	let Result = this.NewNode("GetIndex");
                    Result.Write("Object",Value);
                    Result.Write("Index",Index);
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_IOPEN",
                Type:"Bracket",
                Priority:700,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("GetIndex");
                    Result.Write("Object",Value);
                    Result.Write("Index",this.ParseExpression(-1));
                    this.TestNext("TK_ICLOSE","Bracket");
                    this.Next();
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_POPEN",
                Type:"Bracket",
                Priority:1000,
                Call:function(Value,Priority){
                	this.Next();
                	let Result = this.NewNode("Call");
                    Result.Write("Call",Value);
                    if(!this.CheckNext("TK_PCLOSE","Bracket")){
                    	this.Next();
                    	Result.Write("Arguments",this.ExpressionList(-1));	
                    }else{
                    	Result.Write("Arguments",[]);
                    }
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_SELFCALL",
                Type:"Operator",
                Priority:900,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("SelfCall");
                    Result.Write("Object",Value);
                    if(this.Token.Type!="Identifier"&&this.Token.Type!="Constant"){
                        throw Error("Expected index name for self-call!");
                    }
                    Result.Write("Index",this.Token.Value);
                    this.TestNext("TK_POPEN","Bracket");
                    this.Next();
                    if(!this.CheckNext("TK_PCLOSE","Bracket")){
                    	this.Next();
                    	Result.Write("Arguments",this.ExpressionList(-1));	
                    }else{
                    	Result.Write("Arguments",[]);
                    }
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_EQ",
                Type:"Operator",
                Priority:50,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("SetVariable");
                    Result.Write("Name",Value);
                    Result.Write("Value",this.ParseExpression(-1));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_COLON",
                Type:"Operator",
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Eqs");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_LT",
                Type:"Operator",
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Lt");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_GT",
                Type:"Operator",
                Priority:200,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Gt");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_AND",
                Type:"Operator",
                Priority:150,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("And");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_OR",
                Type:"Operator",
                Priority:151,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("Or");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_IF",
                Type:"Operator",
                Priority:275,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("IsA");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_DSRA",
                Type:"Operator",
                Priority:0,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("ExpressionType");
                    Result.Write("V",Value);
                    Result.Write("T",this.ParseTypeExpression());
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_SRA",
                Type:"Operator",
                Priority:195,
                Call:function(Value,Priority){
                	this.Next(2);
                	let Result = this.NewNode("ExpressionList");
                    Result.Write("V1",Value);
                    Result.Write("V2",this.ParseExpression(Priority));
                	return this.NewExpression(Result,Priority);
                },
            },
            {
            	Value:"TK_SLA",
                Type:"Operator",
                Priority:2000,
                Stop:true,
                Call:function(Value,Priority){
                	this.Next();
                	return this.NewExpression(Value,2000);
                },
            },
        	/*
            {
            	Value:"",
                Type:"",
                Priority:0,
                Call:function(){
                	
                },
            },
            */
        ],
        NewExpression:function(Value,Priority){
        	return new ASTExpression(Value,Priority);
        },
        ParseComplexExpression:function(Expression){
        	if(!(Expression instanceof ASTExpression)){
            	return Expression;
            }
            let Priority = Expression.Priority;
            let Next = this.Tokens[Stack.Position+1];
            if(IsToken(this.Token,"TK_LINEEND","Operator")){
            	return Expression.Value;
            }
            if(!Next){return Expression.Value}
            for(let v of this.ComplexExpressionStates){
            	if(!IsToken(Next,v.Value,v.Type)){continue}
                if(Expression.Priority<=v.Priority){
                	Expression = v.Call.bind(this)(Expression.Value,v.Priority);
                    Expression.Priority = Priority;
                    if(v.Stop===true){break}
                    let Result = this.ParseComplexExpression(Expression);
                    Expression = this.NewExpression(Result,Expression.Priority);
                }
                break;
            }
            return Expression.Value;
        },
        ExpressionStates:[
        	{
                Type:"Constant",
                Stop:false,
                Call:function(Priority){
                	return [this.Token.Value,Priority];
                },
            },
            {
                Type:"Identifier",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("GetVariable");
                    Node.Write("Name",this.Token.RawValue);
                    return [Node,Priority];
                },
            },
            {
            	Type:"Bracket",
                Value:"TK_POPEN",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Result = this.ParseExpression(-1,true);
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
                	return [Result,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_NOT",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("Not");
                    Node.Write("V1",this.ParseExpression(400));
                	return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_IF",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("Length");
                    Node.Write("V1",this.ParseExpression(400));
                	return [Node,Priority];
                },
            },
            {
            	Type:"Bracket",
                Value:"TK_BOPEN",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("NewObject");
                    this.Next();
                    let Obj = [];
                    while(!IsToken(this.Token,"TK_BCLOSE","Bracket")){
                    	let Ind = "";
                    	if(IsToken(this.Token,"TK_IOPEN","Bracket")){
                        	this.Next();
                            Ind=this.ParseExpression(-1);
                            this.TestNext("TK_ICLOSE","Bracket");
                            this.Next();
                        }else{
                        	if(this.Token.Type=="Identifier"||this.Token.Type=="Constant"){
                            	Ind=this.Token.Value;
                            }
                        }
                        let Type = this.GetType();
                        this.TestNext("TK_EQ","Operator");
                        this.Next(2);
                        let Val = this.ParseFullExpression(-1);
                        Obj.push([Ind,Val,Type]);
                        if(this.CheckNext("TK_COMMA","Operator")){
                        	this.Next();
                        }
                    	this.Next();
                        if(this.IsEnd()){
                        	throw Error("Unexpected end of Object");
                        }
                    }
                    Node.Write("Object",Obj);
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_FUNC",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("NewFastFunction");
                    this.TestNext("TK_POPEN","Bracket");
                    this.Next(2);
                    if(!IsToken(this.Token,"TK_PCLOSE","Bracket")){
                    	Node.Write("Parameters",this.IdentifierList(true,false,true,true));
                        this.TestNext("TK_PCLOSE","Bracket");
                    	this.Next();
                    }else{
                    	Node.Write("Parameters",[]);
                    }
                    Node.Write("ReturnType",this.GetType());
                    Node.Write("Body",this.CodeBlock());
                    return [Node,Priority];
                },
            },
            {
            	Type:"Bracket",
                Value:"TK_IOPEN",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("NewArray");
                    this.Next();
                    if(!IsToken(this.Token,"TK_ICLOSE","Bracket")){
                    	Node.Write("Array",this.ExpressionList(-1));
                    	this.TestNext("TK_ICLOSE","Bracket");
                    	this.Next();
                    }else{
                    	Node.Write("Array",[]);
                    }
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_WHILE",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("GetType");
                    this.Next();
                    Node.Write("Expression",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_POW",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("IsPrime");
                    this.Next();
                    Node.Write("V1",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_MUL",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("UnpackArray");
                    this.Next();
                    Node.Write("V1",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_SUB",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("Negative");
                    this.Next();
                    Node.Write("V1",this.ParseExpression(400));
                    return [Node,Priority];
                },
            },
            {
            	Value:"TK_MOD",
                Type:"Operator",
                Stop:true,
                Call:function(Priority){
                	let Node = this.NewNode("UpdateVariable");
                   	this.Next();
                    if(this.Token.Type!="Identifier"){
                    	throw Error("Expected variable name");
                    }
                    Node.Write("Name",this.Token.Value);
                    Node.Write("Expression",this.ParseExpression(-1));
                    return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_ADD",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("NewClass");
                    Node.Write("V1",this.ParseExpression(400));
                	return [Node,Priority];
                },
            },
            {
            	Type:"Operator",
                Value:"TK_EQ",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Node = this.NewNode("MakeFastClass");
                    Node.Write("Object",this.ParseExpression(-1));
                	return [Node,Priority];
                },
            },
        	/*
            {
            	Value:"",
                Type:"",
                Stop:false,
                Call:function(){
                	
                },
            },
            */
        ],
        GetType:function(Priority=-1){
        	if(!this.CheckNext("TK_EQRA","Operator"))return;
            this.Next(2);
            return this.ParseTypeExpression(Priority);
        },
        TypeExpressionList:function(Priority=-1){
        	let List=[];
            do{
            	List.push(this.ParseTypeExpression(Priority));
                if(this.CheckNext("TK_COMMA","Operator")){
                	this.Next(2);
                    continue;
                }
                break;
            }while(true);
            return List;
        },
        ExpressionList:function(Priority=-1){
        	let List = [];
            do{
            	List.push(this.ParseExpression(Priority));
                if(this.CheckNext("TK_COMMA","Operator")){
                	this.Next(2);
                    continue;
                }
                break;
            }while(true);
            return List;
        },
        IdentifierList:function(AllowDefault=false,SkipEnds=false,AllowVarargs=false,AllowType=false){
        	let List = [];
            do{
            	let va = false;
                if(AllowVarargs){
                	if(IsToken(this.Token,"TK_MUL","Operator")){
                    	va=true;
                        this.Next();
                    }
                }
            	if(this.Token.Type!="Identifier"){
                	throw Error(`Expected Identifier for function parameter, got ${this.Token.RawValue} instead!`);
                }
                let v = this.Token.Value;
                let ty
                if (AllowType){
                    ty = this.GetType();
                }
                if(AllowDefault){
                	if(this.CheckNext("TK_EQ","Operator")){
                    	this.Next(2);
                        v=[v,this.ParseExpression(-1)];
                    }
                }
                if(va){
                	if(v instanceof Array){
                    	v[2]=true;
                    }else{
                    	v=[v,undefined,true];
                    }
                }
                if(AllowType&&ty){
                	if(v instanceof Array){
                    	v[3]=ty;
                    }else{
                    	v=[v,undefined,undefined,ty];
                    }
                }
            	List.push(v);
                if(this.CheckNext("TK_COMMA","Operator")){
                	this.Next(2);
                    continue;
                }	
                break;
            }while(true);
            if(SkipEnds){
            	if(this.CheckNext("TK_LINEEND","Operator")){
                	this.Next();
                }
            }
            return List;
        },
        ParseExpression:function(Priority=-1,CommaExpression=false){
        	let Token = this.Token;
            if(!Token){return null}
            let Result = null;
            for(let v of this.ExpressionStates){
            	let d = false;
            	if (!v.Value&&v.Type){
                	if(Token.Type==v.Type){
                    	let [r,p]=v.Call.bind(this)(Priority);
                    	Priority=p;
                    	Result=r;
                        d=true;
                    }
                }else{
                	if(IsToken(Token,v.Value,v.Type)){
                		let [r,p]=v.Call.bind(this)(Priority);
                    	Priority=p;
                    	Result=r;
                        d=true;
                	}
                }
                if(d){
                	if(v.Stop){
                    	return Result;
                    }
                    break;
                }
            }
            if(CommaExpression==true){
            	if(this.CheckNext("TK_COMMA","Operator")){
            		let List = [Result];
                	while(this.CheckNext("TK_COMMA","Operator")){
                		this.Next(2);
                    	List.push(this.ParseExpression(Priority,false));
                		if(this.IsEnd()){break}
                	}
                	Result=this.NewNode("CommaExpression");
                	Result.Write("List",List);
                	return Result;
              	}
            }
            return this.ParseComplexExpression(this.NewExpression(Result,Priority));
        },
        ParseFullExpression:function(Priority=-1,CommaExpression=false){
        	let Result = this.ParseExpression(Priority,CommaExpression);
            if(this.CheckNext("TK_LINEEND","Operator")){
            	this.Next();
            }
            return Result;
        },
        CodeBlock:function(){
        	let Next=this.Next();
            this.OpenChunk();
            let Block = this.Chunk;
            if(IsToken(Next,"TK_BOPEN","Bracket")){
            	this.Next();
            	while(!IsToken(this.Token,"TK_BCLOSE","Bracket")){
                	this.ParseChunk();
                    this.Next();
                	if(this.IsEnd()){
                    	break;
                    }
                }
            }else{
            	this.ParseChunk();
            }
            this.Chunk=this.OpenChunks.pop();
            return Block;
        },
        ComplexTypeExpressionStates:[
        	{
            	Type:"Operator",
                Value:"TK_OR",
                Priority:150,
                Call:function(Value,Priority){
                	let Node = this.NewNode("TypeOr");
                    Node.Write("V1",Value);
                    this.Next(2);
                    Node.Write("V2",this.ParseTypeExpression(Priority));
                    return this.NewExpression(Node,Priority);
                },
            },
            {
            	Type:"Operator",
                Value:"TK_AND",
                Priority:150,
                Call:function(Value,Priority){
                	let Node = this.NewNode("TypeUnion");
                    Node.Write("V1",Value);
                    this.Next(2);
                    Node.Write("V2",this.ParseTypeExpression(Priority));
                    return this.NewExpression(Node,Priority);
                },
            },
        	/*
            {
            	Type:"",
                Value:"",
                Priority:0,
                Call:function(Value,Priority){
                	
                },
            },
            */
        ],
        ParseComplexTypeExpression:function(Expression){
        	if(!(Expression instanceof ASTExpression)){
            	return Expression;
            }
            let Priority = Expression.Priority;
            let Next = this.Tokens[Stack.Position+1];
            if(IsToken(this.Token,"TK_LINEEND","Operator")){
            	return Expression.Value;
            }
            if(!Next){return Expression.Value}
            for(let v of this.ComplexTypeExpressionStates){
            	if(!IsToken(Next,v.Value,v.Type)){continue}
                if(Expression.Priority<=v.Priority){
                	Expression = v.Call.bind(this)(Expression.Value,v.Priority);
                    Expression.Priority = Priority;
                    let Result = this.ParseComplexTypeExpression(Expression);
                    Expression = this.NewExpression(Result,Expression.Priority);
                }
                break;
            }
            return Expression.Value;
        },
        TypeExpressionStates:[
        	{
                Type:"Identifier",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("GetType");
                    Node.Write("Name",this.Token.RawValue);
                    return [Node,Priority];
                },
            },
            {
            	Value:"TK_NOT",
                Type:"Operator",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("TypeNot");
                    this.Next();
                    Node.Write("V1",this.ParseTypeExpression(200));
                    return [Node,Priority];
                },
            },
            {
            	Value:"TK_IF",
                Type:"Operator",
                Stop:false,
                Call:function(Priority){
                	let Node = this.NewNode("TypeNull");
                    this.Next();
                    Node.Write("V1",this.ParseTypeExpression(200));
                    return [Node,Priority];
                },
            },
        	{
            	Value:"TK_POPEN",
                Type:"Bracket",
                Stop:false,
                Call:function(Priority){
                	this.Next();
                    let Result = this.ParseTypeExpression()
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
                	return [Result,Priority];
                },
            },
            {
            	Value:"TK_IOPEN",
                Type:"Bracket",
                Stop:false,
                Call:function(Priority){
                    let Node = this.NewNode("TypeArray");
                    if(!this.CheckNext("TK_ICLOSE","Bracket")){
                    	this.Next();
                    	let Result = this.ParseTypeExpression();
                    	this.TestNext("TK_ICLOSE","Bracket");
                        Node.Write("List",Result);
                    }
                    this.Next();
                	return [Node,Priority];
                },
            },
            {
              Value:"TK_BOPEN",
              Type:"Bracket",
              Stop:false,
              Call:function(Priority){
                let Node = this.NewNode("TypeObject");
                if(!this.CheckNext("TK_BCLOSE","Bracket")){
                  this.Next();
                  if(IsToken(this.Token,"TK_IOPEN","Bracket")){
                    Node.Write("ObjectType","TypedKeys");
                    this.Next();
                    Node.Write("KeyType",this.ParseTypeExpression());
                    this.TestNext("TK_ICLOSE","Bracket");
                    this.Next();
                    this.TestNext("TK_COLON","Operator");
                    this.Next(2);
                    Node.Write("ValueType",this.ParseTypeExpression());
                    this.TestNext("TK_BCLOSE","Bracket");
                    this.Next();
                  }else if(this.Token.Type=="Identifier"||this.Token.Type=="Constant"){
                    Node.Write("ObjectType","NamedKeys");
                    let TypeObject = {};
                    while(true){
                      if(IsToken(this.Token,"TK_BCLOSE","Bracket"))break;
                      if(this.Token.Type=="Identifier"||this.Token.Type=="Constant"){
                        let Key = this.Token.Value;
                        this.TestNext("TK_COLON","Operator");
                        this.Next(2);
                        let Value = this.ParseTypeExpression();
                        TypeObject[Key]=Value;
                      }else{
                        throw Error("Invalid token type in object type statement; expected Identifier or Constant");
                      }
                      if(this.CheckNext("TK_COMMA","Operator")){
                        this.Next(2);
                        continue;
                      }
                      this.Next();
                      break;
                    }
                    Node.Write("TypeObject",TypeObject);
                  }
                }
                return [Node,Priority];
              }
            },
        	/*
            {
            	Value:"",
                Type:"",
                Stop:false,
                Call:function(Priority){
                	
                },
            },
            */
        ],
        ParseTypeExpression:function(Priority=-1){
        	let Token = this.Token;
            if(!Token){return null}
            let Result = null;
            for(let v of this.TypeExpressionStates){
            	let d = false;
            	if (!v.Value&&v.Type){
                	if(Token.Type==v.Type){
                    	let [r,p]=v.Call.bind(this)(Priority);
                    	Priority=p;
                    	Result=r;
                        d=true;
                    }
                }else{
                	if(IsToken(Token,v.Value,v.Type)){
                		let [r,p]=v.Call.bind(this)(Priority);
                    	Priority=p;
                    	Result=r;
                        d=true;
                	}
                }
                if(d){
                	if(v.Stop){
                    	return Result;
                    }
                    break;
                }
            }
            return this.ParseComplexTypeExpression(this.NewExpression(Result,Priority));
        },
        States:[
        	{
            	Value:"TK_IF",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("If");
                    this.Next(1);
                    Node.Write("Expression",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    let Conds = [];
                    while(this.CheckNext("TK_OR","Operator")||this.CheckNext("TK_GT","Operator")){
                    	if(this.CheckNext("TK_OR","Operator")){ // elseif
                        	let ei = this.NewNode("ElseIf");
                            this.Next(2);
                            ei.Write("Expression",this.ParseExpression(-1));
                            ei.Write("Body",this.CodeBlock());
                            Conds.push(ei);
                        }else{ //else
                        	let e = this.NewNode("Else");
                            this.Next();
                            e.Write("Body",this.CodeBlock());
                            Conds.push(e);
                        }
                    }
                    Node.Write("Conditions",Conds);
                    return Node;
                },
            },
            {
            	Value:"TK_AT",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("NewVariable");
                    this.Next(1);
                    let Vars = this.IdentifierList(true,true,false,true);
                    Node.Write("Variables",Vars);
                    return Node;
                },
            },
            {
            	Value:"TK_FUNC",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("NewFunction");
                    this.Next();
                    if(this.Token.Type!="Identifier"){
                    	throw Error(`Expected Identifier for Variable Name, got ${this.Token.RawValue} instead!`);
                    }
                    Node.Write("Name",this.Token.Value);
                    this.TestNext("TK_POPEN","Bracket");
                    this.Next(2);
                    if(!IsToken(this.Token,"TK_PCLOSE","Bracket")){
                    	Node.Write("Parameters",this.IdentifierList(true,false,true,true));
                        this.TestNext("TK_PCLOSE","Bracket");
                    	this.Next();
                    }else{
                    	Node.Write("Parameters",[]);
                    }
                    Node.Write("ReturnType",this.GetType());
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Value:"TK_COLON",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("Each");
                    Node.Write("Names",this.VarList());
                    Node.Write("Iterable",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Value:"TK_LOOP",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("Repeat");
                    Node.Write("Names",this.VarList());
                    Node.Write("Amount",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Type:"Operator",
                Value:"TK_LT",
                Write:true,
                Call:function(){
                	this.Next();
                    let Node = this.NewNode("Return");
                    Node.Write("V1",this.ParseExpression(-1,true));
                	return Node;
                },
            },
            {
            	Type:"Operator",
                Value:"TK_GT",
                Write:true,
                Call:function(){
                    let Node = this.NewNode("Break");
                	return Node;
                },
            },
            {
            	Value:"TK_WHILE",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("While");
                    this.Next();
                    Node.Write("Expression",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Value:"TK_OR",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("For");
                    this.Next();
                    Node.Write("Names",this.IdentifierList(true,true));
                    this.Next();
                    Node.Write("E1",this.ParseFullExpression(-1));
                    this.Next();
                    Node.Write("E2",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Value:"TK_AND",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("Delete");
                    this.Next();
                    Node.Write("Names",this.ExpressionList(-1));
                    return Node;
                },
            },
            {
            	Value:"TK_EQ",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("MakeClass");
                    this.Next();
                    if(this.Token.Type!="Identifier"){
                    	throw Error("Expected variable name for class");
                    }
                    Node.Write("Name",this.Token.Value);
                    this.Next();
                    Node.Write("Object",this.ParseExpression(-1));
                    return Node;
                },
            },
            {
            	Value:"TK_MUL",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("Import");
                    this.Next();
                    if(this.Token.Type!="Identifier"){
                    	throw Error("Expected variable name for import");
                    }
                    Node.Write("Name",this.Token.Value);
                    this.Next();
                    Node.Write("URL",this.ParseExpression(-1));
                    Node.Write("Body",this.CodeBlock());
                    return Node;
                },
            },
            {
            	Value:"TK_DOT",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("Export");
                    this.Next();
                    if(this.Token.Type!="Identifier"&&this.Token.Type!="Constant"){
                    	throw Error("Expected variable name for export");
                    }
                    Node.Write("Name",this.Token.Value);
                    this.Next();
                    Node.Write("Value",this.ParseExpression(-1));
                    return Node;
                },
            },
            {
            	Value:"TK_EQLA",
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("NewType");
                    this.Next();
                    if(this.Token.Type!="Identifier"){
                    	throw Error("Expected variable name for type");
                    }
                    Node.Write("Name",this.Token.Value);
                    this.TestNext("TK_EQ","Operator");
                    this.Next(2);
                    Node.Write("Type",this.ParseTypeExpression());
                    return Node;
                },
            },
            /*
        	{
            	Value:"",
                Type:"",
                Write:false,
                Call:function(){
                	
                },
            },
            */
        ],
        VarList:function(AllowDefault=false){
        	let List = [];
        	this.TestNext("TK_LT","Operator");
            this.Next(2);
            if(IsToken(this.Token,"TK_GT","Operator")){
            	this.Next();
            	return List;
            }
            List = this.IdentifierList(AllowDefault);
            this.TestNext("TK_GT","Operator");
            this.Next(2);
            return List;
        },
        ParseChunk:function(){
        	let Token = this.Token;
            let Done = false;
            for(let v of this.States){
            	if(IsToken(Token,v.Value,v.Type)){
                	let r = v.Call.bind(this)();
                    Done=true;
                    if(v.Write){
                    	this.ChunkWrite(r);
                    }
                    break;
                }
            }
            if(!Done){
            	this.ChunkWrite(this.ParseFullExpression(-1,true));
            }else{
            	if(this.CheckNext("TK_LINEEND","Operator")){
                	this.Next();
                }
            }
        },
    }
    Stack.Chunk=Stack.Result;
    while(!Stack.IsEnd()){
    	Stack.ParseChunk();
        Stack.Next();
    }
    return Stack.Result;
}

class LState {
	constructor(Tokens,Parent,Extra){
    	this.Tokens=Tokens;
        this.Position=0;
        this.Token=Tokens.Data[0];
        this.Parent=Parent;
        this.Children=[];
        this.Exports={};
        this.Data = {
        	Returned:false,
            Returns:undefined,
            IsFunction:false,
        };
        if(Extra){
			for(let k in Extra){
            	this.Data[k]=Extra[k];
            }
        }
        let VI = 0;
        let P = this.Parent;
        while(P){
            VI++;
            P=P.Parent;
        }
        this.StackIndex=VI;
        this.VariableIndex=0;
        if(Parent&&Parent instanceof LState){
        	Parent.Children.push(this);
            this.Exports=Parent.Exports;
        }
        this.Variables=[];
        this.TypeVars={};
    }
    GenerateProxyName(Increment=true){
        let Result = `_s${this.StackIndex}${this.VariableIndex}`;
        if(Increment){
            this.VariableIndex++;
        }
        return Result;
    }
    IsType(Name){
    	return this.TypeVars.hasOwnProperty(Name);
    }
    NewType(Name,Value){
    	this.TypeVars[Name]=Value;
    }
    GetType(Name){
    	if(this.IsType(Name)){
        	return this.TypeVars[Name];
        }else if(this.Parent){
        	return this.Parent.GetType(Name);
        }
    }
    TransferVariable(New,Var){
    	if(!New.IsVariable(Var.Name)){
        	New.Variables.push(Var);
        }
    }
    CodeData(Name,Value){
    	this.Data[Name]=Value;
        if(this.Parent){
        	if(Name=="Returned"||Name=="Returns"){
            	if(!this.GetData("IsFunction")){
      				this.Parent.CodeData(Name,Value);
                }
            }else if(Name=="Stopped"){
            	if(!this.GetData("IsLoop")){
                	this.Parent.CodeData(Name,Value);
                }
            }
        }
    }
    GetData(Name){
    	return this.Data[Name];
    }
    Next(Amount=1){
    	this.Position+=Amount;
        this.Token=this.Tokens.Data[this.Position];
        return this.Token;
    }
    IsEnd(){
    	return this.Position >= this.Tokens.Data.length;
    }
    GetAllUpperVariables(){
    	let Upper = [];
        let Search = this;
        while(Search){
        	for(let v of Search.Variables){
            	Upper.push(v);
            }
        	Search=Search.Parent;
        }
        return Upper;
    }
    Close(){
    	if(this.Parent){
        	this.Parent.Children.splice(this.Parent.Children.indexOf(this),1);
        }
    	let Vars = this.GetAllUpperVariables();
    	for(let c of this.Children){
        	for(let v of Vars){
            	this.TransferVariable(c,v);
            }
            c.Parent = undefined;
        }
        this.Variables=[];
    }
    VariablePrototype(Name,ProxyName){
    	return {
            Name:Name,
            ProxyName:ProxyName,
        }
    }
    GetRawVariable(Name){
    	for(let v of this.Variables){
        	if(v.Name==Name){
            	return v;
            }
        }
    }
    GetAllRawVariable(Name){
    	let v = this.GetRawVariable(Name);
        if(!v&&this.Parent){
        	v=this.Parent.GetAllRawVariable(Name);
        }
        return v;
    }
    IsVariable(Name){
    	return !!this.GetRawVariable(Name);
    }
   	GetVariable(Name){
    	if(this.IsVariable(Name)){
        	return this.GetRawVariable(Name).ProxyName;
        }else if(this.Parent){
        	return this.Parent.GetVariable(Name);
        }
    }
    SetVariable(Name,ProxyName){
    	if(this.IsVariable(Name)){
        	let Var = this.GetRawVariable(Name);
            Var.ProxyName = ProxyName;
        }else if(this.Parent){
        	this.Parent.SetVariable(Name,ProxyName);
        }else{
        	this.NewVariable(Name,ProxyName);
        }
    }
    NewVariable(Name,ProxyName,Extra={}){
    	let Var = this.VariablePrototype(Name,ProxyName);
	    if(Extra){
		    for(let k in Extra){
				Var[k]=Extra[k];	
			}
		}
    	if(this.IsVariable(Name)){
        	this.DeleteVariable(Name,true);
        }
	this.Variables.push(Var);
    }
    DeleteVariable(Name,Local=false){
    	if(this.IsVariable(Name)){
        	for(let k in this.Variables){
            	k=+k;
                let v = this.Variables[k];
                if(v.Name==Name){
                	this.Variables.splice(k,1);
                    break;
                }
            }
        }else if(this.Parent&&!Local){
        	this.Parent.DeleteVariable(Name);
        }
    }
}

class UnpackState {
	constructor(List){
    	this.List=List;
    }
}

const Interpret=(Tokens,Environment)=>{
	const Stack = {
    	Tokens:Tokens,
        Environment:Environment,
        MainState:new LState(Tokens),
        ParseStates:{
        	"GetVariable":function(State,Token){
            	return State.GetVariable(Token.Read("Name"));
            },
            "SetVariable":function(State,Token){
            	let Name = Token.Read("Name");
                let Value = this.Parse(State,Token.Read("Value"));
                let Text = "";
                if(Name instanceof ASTNode){
                	if(Name.Type=="GetVariable"){
                    	Name = State.GetVariable(Name.Read("Name"));
                        Text = `${Name}=${Value}`;
                    }else if(Name.Type=="GetIndex"){
                    	let Obj = this.Parse(State,Name.Read("Object"));
                        let Ind = this.Parse(State,Name.Read("Index"));
                        Text = `${Obj}[${Ind}]=${Value}`;
                    }
                }
            	return Text;
            },
            "UpdateVariable":function(State,Token){
            	let Name = State.GetVariable(Token.Read("Name"));
		let e = Token.Read("Expression");
		if(e instanceof ASTBase){
			let Do=false;
			let Sign="";
			let Val=undefined;
			if(e.Type=="Add"){
				Do=true,Sign="+",Val=this.Parse(State,e.Read("V2"));
			}else if(e.Type=="Sub"){
				Do=true,Sign="-",Val=this.Parse(State,e.Read("V2"));
			}else if(e.Type=="Mul"){
				Do=true,Sign="*",Val=this.Parse(State,e.Read("V2"));
			}else if(e.Type=="Div"){
				Do=true,Sign="/",Val=this.Parse(State,e.Read("V2"));
			}else if(e.Type=="Mod"){
				Do=true,Sign="%",Val=this.Parse(State,e.Read("V2"));
			}else if(e.Type=="Pow"){
				Do=true,Sign="**",Val=this.Parse(State,e.Read("V2"));
			}
			if(Do){
				return `${Name}${Sign}=${Val}`;	
			}
		}
                let Expression = this.Parse(State,Token.Read("Expression"));
                return `${Name}=${Expression}`;
            },
            "NewVariable":function(State,Token){
            	let Variables = Token.Read("Variables");
            	let Texts = [];
                for(let v of Variables){
                    let Value = this.Parse(State,v[1]);
                    let Name = v[0];
                    let ProxyName = State.GenerateProxyName();
                    State.NewVariable(Name,ProxyName);
                	Texts.push(`${ProxyName}=${Value}`);
                }
                return "let "+Texts.join(",");
            },
        	"Add":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}+${V2})`;
            },
            "Sub":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}-${V2})`;
            },
            "Mul":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}*${V2})`;
            },
            "Div":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}/${V2})`;
            },
            "Mod":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}%${V2})`;
            },
            "Pow":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}**${V2})`;
            },
            "Eqs":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}==${V2})`;
            },
            "GetIndex":function(State,Token){
            	let Object = this.Parse(State,Token.Read("Object"));
                let Index = this.Parse(State,Token.Read("Index"));
                return `${Object}[${Index}]`;
            },
            "Call":function(State,Token){
            	let Call = this.Parse(State,Token.Read("Call"));
                let Arguments = this.ParseArray(State,Token.Read("Arguments"));
                return `${Call}(${Arguments})`;
            },
            "SelfCall":function(State,Token){
            	let Object = this.Parse(State,Token.Read("Object"));
                let Index = this.Parse(State,Token.Read("Index"));
                let Arguments = this.ParseArray(State,Token.Read("Arguments"));
                return `${Object}[${Index}](${Object},${Arguments})`;
            },
            "Lt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}<${V2})`;
            },
            "Gt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}>${V2})`;
            },
            "Not":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return `!${V1}`;
            },
            "And":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
            	let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}&&${V2})`;
            },
            "Or":function(State,Token){
		let v1=Token.Read("V1");
		let v2=Token.Read("V2");
		if(v1 instanceof ASTBase && v2 instanceof ASTBase){
			if((v1.Type=="Eqs"&&v2.Type=="Lt")||(v1.Type=="Lt"&&v2.Type=="Eqs")){
				let v1v1 = this.Parse(State,v1.Read("V1"));
				let v1v2 = this.Parse(State,v1.Read("V2"));
				let v2v1 = this.Parse(State,v2.Read("V1"));
				let v2v2 = this.Parse(State,v2.Read("V2"));
				if(v1v1==v2v1&&v1v2==v2v2){
					return `(${v1v1}<=${v1v2})`;	
				}
			}else if((v1.Type=="Eqs"&&v2.Type=="Gt")||(v1.Type=="Gt"&&v2.Type=="Eqs")){
				let v1v1 = this.Parse(State,v1.Read("V1"));
				let v1v2 = this.Parse(State,v1.Read("V2"));
				let v2v1 = this.Parse(State,v2.Read("V1"));
				let v2v2 = this.Parse(State,v2.Read("V2"));
				if(v1v1==v2v1&&v1v2==v2v2){
					return `(${v1v1}>=${v1v2})`;	
				}
			}
		}
            	let V1 = this.Parse(State,Token.Read("V1"));
            	let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1}||${V2})`;
            },
            "Return":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return `return ${V1}`;
            },
            "Break":function(State,Token){
                return "break";
            },
            "If":function(State,Token){
            	let Exp = this.Parse(State,Token.Read("Expression"));
                let Body = Token.Read("Body");
                let Conds = Token.Read("Conditions");
                let ns1 = new LState(Body,State);
                let t = ""
                t+=`if(${Exp}){`;
                t+=this.ParseBlock(ns1);
                t+="}";
                if(Conds.length>0){
                	for(let v of Conds){
                		if(v.Type=="ElseIf"){
                			let ep = this.Parse(State,v.Read("Expression"));
                			let by = v.Read("Body");
                			t+=`else if(${ep}){`;
                			t+=this.ParseBlock(new LState(by,State));
                			t+="}";
                		}else if(v.Type=="Else"){
                			let by = v.Read("Body");
                			t+="else{";
                			t+=this.ParseBlock(new LState(by,State));
                			t+="}";
                		}
                	}
                }
                return t;
            },
            "NewFunction":function(State,Token){
            	let Name = Token.Read("Name");
            	let ProxyName = State.GenerateProxyName();
            	State.NewVariable(Name,ProxyName);
            	let Body = Token.Read("Body");
            	let Parameters = Token.Read("Parameters");
            	let Params = [];
            	let S = new LState(Body,State);
            	for(let v of Parameters){
            		let n = "";
            		if(v instanceof Array){
            		    let pn = S.GenerateProxyName();
            		    S.NewVariable(v[0],pn);
            			if(v[2]===true){
            				n=`...${pn}`;
            			}else if(v[1]!=undefined){
            				n=`${pn}=${this.Parse(State,v[1])}`;
            			}
            		}else{
            		    let pn = S.GenerateProxyName();
            		    S.NewVariable(v,pn);
            			n=pn;
            		}
            		Params.push(n);
            	}
            	let t="";
                t+=`function ${ProxyName}(${Params.join(",")}){`;
                t+=this.ParseBlock(S);
                t+="}";
                return t;
            },
            "NewFastFunction":function(State,Token){
            	let Body = Token.Read("Body");
            	let Parameters = Token.Read("Parameters");
            	let Params = [];
            	let S = new LState(Body,State);
            	for(let v of Parameters){
            		let n = "";
            		if(v instanceof Array){
            		    let pn = S.GenerateProxyName();
            		    S.NewVariable(v[0],pn);
            			if(v[2]===true){
            				n=`...${pn}`;
            			}else if(v[1]!=undefined){
            				n=`${pn}=${this.Parse(State,v[1])}`;
            			}
            		}else{
            		    let pn = S.GenerateProxyName();
            		    S.NewVariable(v,pn);
            			n=pn;
            		}
            		Params.push(n);
            	}
            	let t=""
                t+=`function(${Params.join(",")}){`;
                t+=this.ParseBlock(S);
                t+="}";
                return t;
            },
            "NewObject":function(State,Token){
                let Result = [];
                let Obj = Token.Read("Object");
                for(let v of Obj){
                	let va = this.Parse(State,v[1]);
                	Result.push(`${this.Parse(State,v[0])}:${va}`);
                }
                return `{${Result.join(",")}}`;
            },
            "NewArray":function(State,Token){
                let Result = [];
                let Arr = Token.Read("Array");
                for(let k in Arr){
                	let v = Arr[k];
                    let r = this.Parse(State,v);
                	Result.push(r);
                }
                return `[${Result.join(",")}]`;
            },
            "Each":function(State,Token){
                let Iter = this.Parse(State,Token.Read("Iterable"));
                let VNames = Token.Read("Names");
                let Body = Token.Read("Body");
                let t="";
                let ns = new LState(Body,State);
                let pns=[ns.GenerateProxyName(),ns.GenerateProxyName()];
                t+=(`let ${pns[0]}=${Iter};for(let ${pns[1]} in ${pns[0]}){`);
                if(VNames.length>0){
                    t+="let "
                    let Ns = [];
                    let vs = [pns[1],`${pns[0]}[${pns[1]}]`,pns[0]];
                    for(let kk in VNames){
                        let Name = VNames[+kk];
                        let ProxyName = ns.GenerateProxyName();
                        ns.NewVariable(Name,ProxyName);
                    	Ns.push(`${ProxyName}=${vs[+kk]}`);
                    }
                    t+=Ns.join(",")+";";
                }
                t+=this.ParseBlock(ns);
                t+=(`}${pns[0]}=undefined;`)
                return t;
            },
            "Repeat":function(State,Token){
                let Max = this.Parse(State,Token.Read("Amount"));
                let VNames = Token.Read("Names");
                let Body = Token.Read("Body");
                let t="";
                let ns = new LState(Body,State);
                let pns=[ns.GenerateProxyName(),ns.GenerateProxyName()];
                t+=(`for(let ${pns[0]}=1,${pns[1]}=${Max};${pns[0]}<=${pns[1]};${pns[0]}++){`);
                if(VNames.length>0){
                    t+="let ";
                    let Ns = [];
                    let vs = [pns[0],pns[1]];
                    for(let kk in VNames){
                        let Name = VNames[+kk];
                        let ProxyName = ns.GenerateProxyName();
                        ns.NewVariable(Name,ProxyName);
                    	Ns.push(`${ProxyName}=${vs[+kk]}`);
                    }
                    t+=(Ns.join(",")+";");
                }
                t+=(this.ParseBlock(ns));
                t+=("}");
                return t;
            },
            "CommaExpression":function(State,Token){
            	let List = Token.Read("List");
                let Result = [];
                for(let k in List){
                	Result.push(this.Parse(State,List[k]));
                }
                return Result.join(",");
            },
            "Length":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return `${V1}.length`;
            },
            "GetType":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("Expression"));
                return `_SS_GETTYPE(${V1})`;
            },
            "While":function(State,Token){
                let Expression = this.Parse(State,Token.Read("Expression"));
                let Body = Token.Read("Body");
                let t="";
                t+=(`while(${Expression}){`);
                t+=(this.ParseBlock(new LState(Body,State)));
                t+=("}");
                return t;
            },
            "For":function(State,Token){
                let Names = Token.Read("Names");
                let Body = Token.Read("Body");
                let es = new LState(Body,State);
                let t="";
                t+=("for(let ");
                let Ns = [];
                for(let k in Names){
                	let v = Names[k];
                	let Name = v[0];
                	let ProxyName = es.GenerateProxyName();
                	es.NewVariable(Name,ProxyName);
                	Ns.push(`${ProxyName}=${this.Parse(es,v[1])}`);
                }
		let E1 = this.Parse(es,Token.Read("E1"));
                let E2 = this.Parse(es,Token.Read("E2"));
                t+=(Ns.join(",")+`;${E1};${E2}){`);
                t+=(this.ParseBlock(es));
                t+=("}");
		        return t;
            },
            "IsPrime":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return `_SS_ISPRIME(${V1})`;
            },
            "Negative":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return `(-${V1})`;
            },
            "Delete":function(State,Token){
            	let Names = Token.Read("Names");
                for(let v of Names){
                	if(v instanceof ASTNode){
                    	if(v.Type=="GetIndex"){
                        	let Obj = this.Parse(State,v.Read("Object"));
                            let Ind = this.Parse(State,v.Read("Index"));
                            return `delete ${Obj}[${Ind}]`;
                        }else if(v.Type=="GetVariable"){
                            State.DeleteVariable(v.Read("Name"));
                        }
                    }
                }
            },
            "NewClass":function(State,Token){
            	let V1 = Token.Read("V1");
                if(V1.Type=="Call"){
                	let Call = this.Parse(State,V1.Read("Call"));
                    let Arguments = this.ParseArray(State,V1.Read("Arguments"));
                    return `new ${Call}(${Arguments})`;
                }else{
                	return `new ${this.Parse(State,V1)()}`;
                }
            },
            "MakeClass":function(State,Token){
            	let Name = Token.Read("Name");
            	let ProxyName = State.GenerateProxyName();
            	State.NewVariable(Name,ProxyName);
            	let Obj = this.Parse(State,Token.Read("Object"));
            	return(`function ${ProxyName}(...__a){let __o=${Obj};for(let k in __o)if(k!="constructor")this[k]=__o[k];__a.unshift(this);__o.constructor.apply(this,__a);return this}`);
            },
            "MakeFastClass":function(State,Token){
            	let Obj = this.Parse(State,Token.Read("Object"));
            	return(`function(...__a){let __o=${Obj};for(let k in __o)if(k!="constructor")this[k]=__o[k];__a.unshift(this);__o.constructor.apply(this,__a);return this}`);
            },
            "IsA":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return `(${V1} instanceof ${V2})`;
            },
            "ExpressionList":function(State,Token){
              let V1 = this.Parse(State,Token.Read("V1"));
              let V2 = this.Parse(State,Token.Read("V2"));
              return `[${V1},${V2}][1]`;
            },
            "UnpackArray":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
            	return `...${V1}`;
            },
        },
        ParseArray:function(State,Base){
        	let List = [];
            for (let k in Base){
            	let v = Base[k];
                let r;
                if(typeof v=="object"&&!(v instanceof ASTBase)){
                	r=`[${this.ParseArray(State,v)}]`;
                }else{
                	r=this.Parse(State,v,true);
                }
                List.push(r);
            }
            return List.join(",");
        },
        GetType:function(v){
        	let t = typeof v;
            if(t=="object"){
            	if(!v)return"null";
            	if(v instanceof Array)return "array";
            }
            return t;
        },
        Parse:function(State,Token,Unpack=false){
        	if(!(Token instanceof ASTBase)){
        		if(typeof Token=="string"){
        			return `"${Token}"`;
        		}
            	return Token;
            }
            for(let k in this.ParseStates){
            	let v = this.ParseStates[k];
                if(Token.Type==k){
                	return v.bind(this)(State,Token);
                }
            }
        },
        ParseBlock:function(State){
            let t = "";
        	while(!State.IsEnd()){
        		let Result = this.Parse(State,State.Token);
        		if(Result){
        			t+=(Result+";");	
        		}
                State.Next();
            }
            State.Close();
            return t;
        },
        FinishedText:"",
        Write:function(Text){
        	this.FinishedText+=Text;
        }
    }
    Stack.Write(`const _SS_ISPRIME=function(V1){for(let i=2;i<V1;i++)if(V1%i===0)return false;return V1>1},_SS_GETTYPE=function(v){let t =typeof v;if(t=="object"){if(!v)return"null";if(v instanceof Array)return "array"}return t};`);
    let Ns = [];
    for (let k in Environment){
        let v = Environment[k];
        let pn = Stack.MainState.GenerateProxyName();
        Stack.MainState.NewVariable(k,pn);
        let nv = v;
        if(v.Type=="Global"){
            nv=v.Value;
        }else if(v.Type=="String"){
            nv=`"${v.Value}"`;
        }else{
            nv=String(v.Value);
        }
    	Ns.push(`${pn}=${nv}`);
    }
    if(Ns.length>0){
        Stack.Write("let ");
        Stack.Write(Ns.join(",")+";");
    }
    Stack.Write(Stack.ParseBlock(Stack.MainState));
    return Stack.FinishedText;
}

const RunCode = function(Code="",Environment={},Settings={}){
	Code=Tokenize(Code);
    if(Settings.PrintTokens){
    	document.write(Code);
    }
    Code=AST(Code);
    if(Settings.PrintAST){
    	document.write(Code);
    }
    Code=Interpret(Code,Environment);
    return Code;
}
