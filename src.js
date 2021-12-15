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
    //{{ String Tokens }}\\
    "TK_QUOTE":{v:"\"",t:"String"},
    //{{ String Tokens }}\\
    "TK_APOS":{v:"'",t:"Number"},
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
                Priority:150,
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
            if(!Next){return Expression.Value}
            for(let v of this.ComplexExpressionStates){
            	if(!IsToken(Next,v.Value,v.Type)){continue}
                if(Expression.Priority<=v.Priority){
                	Expression = v.Call.bind(this)(Expression.Value,v.Priority);
                    Expression.Priority = Priority;
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
                        this.TestNext("TK_EQ","Operator");
                        this.Next(2);
                        let Val = this.ParseFullExpression(-1);
                        Obj.push([Ind,Val]);
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
                    	Node.Write("Parameters",this.IdentifierList(true));
                        this.TestNext("TK_PCLOSE","Bracket");
                    	this.Next();
                    }else{
                    	Node.Write("Parameters",[]);
                    }
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
        IdentifierList:function(AllowDefault=false,SkipEnds=false){
        	let List = [];
            do{
            	if(this.Token.Type!="Identifier"){
                	throw Error(`Expected Identifier for function parameter, got ${this.Token.RawValue} instead!`);
                }
                let v = this.Token.Value;
                if(AllowDefault){
                	if(this.CheckNext("TK_EQ","Operator")){
                    	this.Next(2);
                        v=[v,this.ParseExpression(-1)];
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
                    let Vars = this.IdentifierList(true,true);
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
                    this.Next(1);
                    if(this.Token.Type!="Identifier"){
                    	throw Error(`Expected Identifier for Variable Name, got ${this.Token.RawValue} instead!`);
                    }
                    Node.Write("Name",this.Token.Value);
                    this.TestNext("TK_POPEN","Bracket");
                    this.Next(2);
                    if(!IsToken(this.Token,"TK_PCLOSE","Bracket")){
                    	Node.Write("Parameters",this.IdentifierList(true));
                        this.TestNext("TK_PCLOSE","Bracket");
                    	this.Next();
                    }else{
                    	Node.Write("Parameters",[]);
                    }
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
        if(Parent&&Parent instanceof LState){
        	Parent.Children.push(this);
            this.Exports=Parent.Exports;
        }
        this.Variables=[];
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
    VariablePrototype(Name,Value){
    	return {
            Name:Name,
            Value:Value,
        }
    }
    GetRawVariable(Name){
    	for(let v of this.Variables){
        	if(v.Name==Name){
            	return v;
            }
        }
    }
    IsVariable(Name){
    	return !!this.GetRawVariable(Name);
    }
   	GetVariable(Name){
    	if(this.IsVariable(Name)){
        	return this.GetRawVariable(Name).Value;
        }else if(this.Parent){
        	return this.Parent.GetVariable(Name);
        }
    }
    SetVariable(Name,Value){
    	if(this.IsVariable(Name)){
        	let Var = this.GetRawVariable(Name);
            Var.Value = Value;
        }else if(this.Parent){
        	this.Parent.SetVariable(Name,Value);
        }else{
        	this.NewVariable(Name,Value);
        }
    }
    NewVariable(Name,Value){
    	if(!this.IsVariable(Name)){
        	let Var = this.VariablePrototype(Name,Value);
        	this.Variables.push(Var);
        }
    }
    DeleteVariable(Name){
    	if(this.IsVariable(Name)){
        	for(let k in this.Variables){
            	k=+k;
                let v = this.Variables[k];
                if(v.Name==Name){
                	this.Variables.splice(k,1);
                    break;
                }
            }
        }else if(this.Parent){
        	this.Parent.DeleteVariable(Name);
        }
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
                //State.SetVariable(Token.Read("Name"),Token.Read("Value"));
                if(Name instanceof ASTNode){
                	if(Name.Type=="GetVariable"){
                    	Name = Name.Read("Name");
                     	State.SetVariable(Name,Value);
                    }else if(Name.Type=="GetIndex"){
                    	let Obj = this.Parse(State,Name.Read("Object"));
                        let Ind = this.Parse(State,Name.Read("Index"));
                        Obj[Ind]=Value;
                    }
                }
            	return Value;
            },
            "UpdateVariable":function(State,Token){
            	let Name = Token.Read("Name");
                let Expression = this.Parse(State,Token.Read("Expression"));
                State.SetVariable(Name,Expression);
            },
            "NewVariable":function(State,Token){
            	let Variables = Token.Read("Variables");
                for(let v of Variables){
                	State.NewVariable(v[0],this.Parse(State,v[1]));
                }
            },
        	"Add":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1+V2;
            },
            "Sub":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1-V2;
            },
            "Mul":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1*V2;
            },
            "Div":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1/V2;
            },
            "Mod":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1%V2;
            },
            "Pow":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1**V2;
            },
            "Eqs":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1==V2;
            },
            "GetIndex":function(State,Token){
            	let Object = this.Parse(State,Token.Read("Object"));
                let Index = this.Parse(State,Token.Read("Index"));
                let Value = Object[Index];
                if(typeof Value=="function")Value=Value.bind(Object);
                return Value;
            },
            "Call":function(State,Token){
            	let Call = this.Parse(State,Token.Read("Call"));
                let Arguments = this.ParseArray(State,Token.Read("Arguments"));
                return Call(...Arguments);
            },
            "Lt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1<V2;
            },
            "Gt":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1>V2;
            },
            "Not":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return !V1;
            },
            "And":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                if (V1){
                	let V2 = this.Parse(State,Token.Read("V2"));
                    return V1&&V2;
                }
                return false;
            },
            "Or":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                if (V1){
                	return V1;
                }else{
                	let V2 = this.Parse(State,Token.Read("V2"));
                    if (V2){return V2}
                    return V1||V2;
                }
            },
            "Return":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                State.CodeData("Returned",true);
                State.CodeData("Returns",V1);
            },
            "Break":function(State,Token){
                State.CodeData("Stopped",true);
            },
            "If":function(State,Token){
            	let Exp = this.Parse(State,Token.Read("Expression"));
                let Body = Token.Read("Body");
                let Conds = Token.Read("Conditions");
                if(Exp){
                	let NewState = new LState(Body,State);
                    this.ParseBlock(NewState);
                }else{
                	if(Conds.length<=0){return}
                    let Stop = false;
                    for(let v of Conds){
                    	if(Stop){break}
                        if(v.Type=="ElseIf"){
                        	let ep = this.Parse(State,v.Read("Expression"));
                			let by = v.Read("Body");
                            if(ep){
                            	Stop=true;
                                let ns = new LState(by,State);
                                this.ParseBlock(ns);
                            }
                        }else if(v.Type=="Else"){
                        	let by = v.Read("Body");
                            Stop = true;
                            let ns = new LState(by,State);
                            this.ParseBlock(ns);
                        }
                    }
                }
            },
            "NewFunction":function(State,Token){
            	let Name = Token.Read("Name");
                let Callback = this.FunctionState(State,Token);
                State.NewVariable(Name,Callback);
            },
            "NewFastFunction":function(State,Token){
                return this.FunctionState(State,Token);
            },
            "NewObject":function(State,Token){
                let Result = {};
                let Obj = Token.Read("Object");
                for(let v of Obj){
                	Result[this.Parse(State,v[0])]=this.Parse(State,v[1]);
                }
                return Result;
            },
            "NewArray":function(State,Token){
                let Result = [];
                let Arr = Token.Read("Array");
                for(let k in Arr){
                	let v = Arr[k];
                	Result[+k]=this.Parse(State,v);
                }
                return Result;
            },
            "Each":function(State,Token){
                let Iter = this.Parse(State,Token.Read("Iterable"));
                let VNames = Token.Read("Names");
                let Body = Token.Read("Body");
                for(let k in Iter){
                	let v = Iter[k];
                    let ns = new LState(Body,State,{IsLoop:true,InLoop:true});
                    let vs = [k,v,Iter];
                    for(let kk in VNames)ns.NewVariable(VNames[+kk],vs[+kk]);
                    this.ParseBlock(ns);
                    if(ns.GetData("InLoop")==false)break;
                }
            },
            "Repeat":function(State,Token){
                let Max = this.Parse(State,Token.Read("Amount"));
                let VNames = Token.Read("Names");
                let Body = Token.Read("Body");
                for(let i=1;i<=Max;i++){
                    let ns = new LState(Body,State,{IsLoop:true,InLoop:true});
                    let vs = [i,Max];
                    for(let kk in VNames)ns.NewVariable(VNames[+kk],vs[+kk]);
                    this.ParseBlock(ns);
                    if(ns.GetData("InLoop")==false)break;
                }
            },
            "CommaExpression":function(State,Token){
            	let List = Token.Read("List");
                let Result = [];
                for(let k in List){
                	Result[k]=this.Parse(State,List[k]);
                }
                return Result[Result.length-1];
            },
            "Length":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return V1.length;
            },
            "GetType":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("Expression"));
                return this.GetType(V1);
            },
            "While":function(State,Token){
                let Expression = Token.Read("Expression");
                let Body = Token.Read("Body");
                while(this.Parse(State,Expression)){
                    let ns = new LState(Body,State,{IsLoop:true,InLoop:true});
                    this.ParseBlock(ns);
                    if(ns.GetData("InLoop")==false)break;
                }
            },
            "For":function(State,Token){
                let E1 = Token.Read("E1");
                let E2 = Token.Read("E2");
                let Names = Token.Read("Names");
                let Body = Token.Read("Body");
                let es = new LState(State.Tokens,State);
                for(let k in Names){
                	let v = Names[k];
                	es.NewVariable(v[0],v[1]);
                }
                while(this.Parse(es,E1)){
                    let ns = new LState(Body,es,{IsLoop:true,InLoop:true});
                    this.ParseBlock(ns);
                    if(ns.GetData("InLoop")==false)break;
                    this.Parse(es,E2);
                }
            },
            "IsPrime":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                for(let i=2;i<V1;i++)
                	if(V1%i===0)return false;
                return V1>1;
            },
            "Negative":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                return -V1;
            },
            "Delete":function(State,Token){
            	let Names = Token.Read("Names");
                for(let v of Names){
                	if(v instanceof ASTNode){
                    	if(v.Type == "GetVariable"){
                        	State.DeleteVariable(v.Read("Name"));
                        }else if(v.Type=="GetIndex"){
                        	let Obj = this.Parse(State,v.Read("Object"));
                            let Ind = this.Parse(State,v.Read("Index"));
                            delete Obj[Ind];
                        }
                    }
                }
            },
            "NewClass":function(State,Token){
            	let V1 = Token.Read("V1");
                if(V1.Type=="Call"){
                	let Call = this.Parse(State,V1.Read("Call"));
                    let Arguments = this.ParseArray(State,V1.Read("Arguments"));
                    return new Call(...Arguments);
                }else{
                	return new V1();
                }
            },
            "MakeClass":function(State,Token){
            	State.NewVariable(Token.Read("Name"),this.ClassState(State,Token));
            },
            "MakeFastClass":function(State,Token){
            	return this.ClassState(State,Token);
            },
            "IsA":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1 instanceof V2;
            },
            "Export":function(State,Token){
            	let Name = this.Parse(State,Token.Read("Name"));
                let Value = this.Parse(State,Token.Read("Value"));
               	State.Exports[Name]=Value;
            },
            "Import":function(State,Token){
            	let URL = this.Parse(State,Token.Read("URL"));
                let Name = Token.Read("Name");
                let Body = Token.Read("Body");
                if(!URL.match(/(^http(s)?\:\/{2})/)){
                	URL="https://fireyauto.github.io/SingleScript/imports/"+URL+".singlescript";
                }
               	let imported=undefined,xml=new XMLHttpRequest(),self=this,vs=State.GetAllUpperVariables(),v={};
                for(let x of vs){
                	v[x.Name]=x.Value;
                }
                xml.onreadystatechange=function(){
                	if(this.readyState==this.DONE){
                    	imported=RunCode(this.response,v).MainState.Exports;
                        let ns = new LState(Body,State);
                        ns.NewVariable(Name,imported);
                        for(let k in v){
                        	ns.NewVariable(k,v[k]);
                        }
                        self.ParseBlock(ns);
                    }
                }
            	xml.open("GET",URL);
      			xml.send();                
            },
        },
        ParseArray:function(State,Base){
        	let List = [];
            for (let k in Base){
            	let v = Base[k];
                if(typeof v=="object"&&!(v instanceof ASTBase)){
                	List.push(this.ParseArray(State,v));
                }else{
                	List.push(this.Parse(State,v));
                }
            }
            return List;
        },
        GetType:function(v){
        	let t = typeof v;
            if(t=="object"){
            	if(!v){return "null"}
            	if(v instanceof Array){
                	return "array";
                }
            }
            return t;
        },
        ClassState:function(State,Token){
        	let self = this;
            let Obj = this.Parse(State,Token.Read("Object"));
            let Call = function(...a){
            	let r = Obj.constructor(this,...a);
                if(r===undefined){
                	r=this;
                }
                return r;
            };
            Call.constructor=Obj.constructor;
            Call.prototype=Obj;
            return Call;
        },
        FunctionState:function(State,Token){
        	let self = this;
            let Body = Token.Read("Body");
            let Parameters = Token.Read("Parameters");
            let PVars = State.GetAllUpperVariables();
            let Callback = function(...Arguments){
          		let NewState = new LState(Body,State,{IsFunction:true});
            	NewState.IsFunction=true;
                for (let k in Parameters){
                    let av = Arguments[k];
                    let pv = Parameters[k];
                    if(av===undefined){
                    	av=self.Parse(State,pv[1]);
                    }
               		NewState.NewVariable(pv[0],av);
               	}
                for (let v of PVars){
                	State.TransferVariable(NewState,v);
                }
                self.ParseBlock(NewState);
                return NewState.GetData("Returns");
          	}
            return Callback;
        },
        Parse:function(State,Token){
        	if(!(Token instanceof ASTBase)){
            	return Token;
            }
            for(let k in this.ParseStates){
            	let v = this.ParseStates[k];
                if(Token.Type==k){
                	return v.bind(this)(State,Token);
                }
            }
            return Token;
        },
        ParseBlock:function(State){
        	while(!State.IsEnd()){
            	this.Parse(State,State.Token);
                State.Next();
               	if(State.GetData("Returned")==true){
                	State.CodeData("InLoop",false);
                    break;
               	}
                if(State.GetData("Stopped")==true){
                	State.CodeData("InLoop",false);
                    break;
                }
            }
            State.Close();
        }
    }
    for (let k in Environment){
    	Stack.MainState.NewVariable(k,Environment[k]);
    }
    Stack.ParseBlock(Stack.MainState);
    return Stack;
}

const RunCode = function(Code="",Environment={}){
	Code=Tokenize(Code);
    Code=AST(Code);
    Code=Interpret(Code,Environment);
    return Code;
}

const output = document.getElementById("output");

const _apply=(a,b)=>{
	for(let k in b){
    	let v = b[k];
        if(typeof v =="object"){
        	_apply(a[k],v);
        }else{
        	a[k]=v;
        }
    }
}

const make=(a,b,c)=>{
	let e=document.createElement(a);
    if(b){
    	_apply(e,b);
    }
    c.appendChild(e);
}

const JoinArray=(a,p)=>{
	let s = [];
    for(let v of a){
    	s.push(String(v));
    }
    return s.join(p)
}

const Library = {
	l:function(...a){
    	make("p",{
        	innerHTML:JoinArray(a),
            style:{
            	marginTop:"0",
                marginBottom:"0",
            },
        },output);
	},
    D:document,
    W:window,
    V:"SingleScript v0.001.12-15-21"
}

Library.E = Library;
