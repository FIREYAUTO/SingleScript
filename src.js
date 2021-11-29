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
                Priority:300,
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
                    let Result = this.ParseExpression(-1);
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
                    Node.Write("V1",this.ParseExpression(350));
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
                    Node.Write("V1",this.ParseExpression(350));
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
                    Node.Write("Parameters",this.IdentifierList());
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
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
                    Node.Write("Array",this.ExpressionList(-1));
                    this.TestNext("TK_ICLOSE","Bracket");
                    this.Next();
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
        IdentifierList:function(){
        	let List = [];
            do{
            	if(this.Token.Type!="Identifier"){
                	throw Error(`Expected Identifier for function parameter, got ${this.Token.RawValue} instead!`);
                }
            	List.push(this.Token.Value);
                if(this.CheckNext("TK_COMMA","Operator")){
                	this.Next(2);
                    continue;
                }
                break;
            }while(true);
            return List;
        },
        ParseExpression:function(Priority=-1){
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
            return this.ParseComplexExpression(this.NewExpression(Result,Priority));
        },
        ParseFullExpression:function(Priority=-1){
        	let Result = this.ParseExpression();
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
                Type:"Operator",
                Write:true,
                Call:function(){
                	let Node = this.NewNode("If");
                    return Node;
                },
            },
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
                    if(this.Token.Type!="Identifier"){
                    	throw Error(`Expected Identifier for Variable Name, got ${this.Token.RawValue} instead!`);
                    }
                    Node.Write("Name",this.Token.Value);
                    this.TestNext("TK_EQ","Operator");
                    this.Next(2);
                    Node.Write("Value",this.ParseFullExpression(-1));
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
                    Node.Write("Parameters",this.IdentifierList());
                    this.TestNext("TK_PCLOSE","Bracket");
                    this.Next();
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
                    Node.Write("V1",this.ParseExpression(-1));
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
        VarList:function(){
        	let List = [];
        	this.TestNext("TK_LT","Operator");
            this.Next(2);
            if(IsToken(this.Token,"TK_GT","Operator")){
            	this.Next();
            	return List;
            }
            List = this.IdentifierList();
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
            	this.ChunkWrite(this.ParseFullExpression(-1));
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
        }
        this.Variables=[];
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
            	c.NewVariable(v.Name,v.Value);
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
            "NewVariable":function(State,Token){
            	let Name = Token.Read("Name");
                let Value = this.Parse(State,Token.Read("Value"));
                State.NewVariable(Name,Value);
                return Value;
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
                return Object[Index];
            },
            "Call":function(State,Token){
            	let Call = this.Parse(State,Token.Read("Call"));
                let Arguments = this.ParseArray(State,Token.Read("Arguments"));
                return Call(...Arguments);
            },
            "Eqs":function(State,Token){
            	let V1 = this.Parse(State,Token.Read("V1"));
                let V2 = this.Parse(State,Token.Read("V2"));
                return V1==V2;
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
        FunctionState:function(State,Token){
        	let self = this;
            let Body = Token.Read("Body");
            let Parameters = Token.Read("Parameters");
            let Callback = function(...Arguments){
          		let NewState = new LState(Body,State,{IsFunction:true});
            	NewState.IsFunction=true;
                for (let k in Parameters){
                    let av = Arguments[k];
                    let pv = Parameters[k];
                    if(!pv){break}
               		NewState.NewVariable(pv,av);
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