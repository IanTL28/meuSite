class calcController {
    
    constructor(){

        this._audio = new Audio("click.mp3");
        this._audioOnOff = false; 
        
        this._locale = "pt-BR";
        
        this._lastNumber = "";
        this._lastOperator = "";
        this._operation = [];

        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    pasteFromClipBoard(){

        document.addEventListener("paste", e=> {

            let text = e.clipboardData.getData("Text");
            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipBoard(){

        let input = document.createElement("input");

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    initialize(){

        this.setDisplay_Date_Time();

        setInterval(() =>{
            this.setDisplay_Date_Time();
        },1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelector("#ac").addEventListener("dblclick", e =>{
            this.toglleAudio();
        })
    }

    setDisplay_Date_Time(){
        this.date = this.currentDate.toLocaleDateString(this._locale);
        this.time = this.currentDate.toLocaleTimeString(this._locale);
    }

    toglleAudio(){
        //this._audioOnOff = (this._audioOnOff) ? false : true; OU

        this._audioOnOff = ! this._audioOnOff;
    }

    playAudio(){
        
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){

        document.addEventListener("keyup", e => {

            this.playAudio();

            switch(e.key) {

                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "6":
                case "5":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseFloat(e.key));
                    break;
                
                //caso a tecla c seja apertada junto com a ctrl, realizar o metodo copyToClipBoard
                case "c":
                    if(e.ctrlKey) this.copyToClipBoard();
                    break;
            }

        })
    }

    addEventListenerAll(element, events, fn){

        events.split(" ").forEach(event => {

            element.addEventListener(event, fn, false);
        });
    }

    setError(){

        this.displayCalc = "Error";
    }

    clearAll(){

        this._operation = [];

        this._lastNumber = "";
        this._lastOperator = "";

        this.setLastNumberToDisplay();
    }

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();
    }


    isOperator(value){
        return (["+","-","*","/","%"].indexOf(value) > -1);
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }
    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    getLastOperation(){
        return this._operation[this._operation.length -1];
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){
            
            if(this.isOperator(value)){

                this.setLastOperation(value);
            }
        
            else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }

        else {
            
            if(this.isOperator(value)){
                this.pushOperation(value);
            }

            else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let cont = this._operation.length-1; cont>=0; cont--){

            if(isOperator == true){

                if(this.isOperator(this._operation[cont])){
                    lastItem = this._operation[cont];
                    break;
                }
            }

            else{

                if(!this.isOperator(this._operation[cont])){
                    lastItem = this._operation[cont];
                    break;
                }
            }
        }

        if(!lastItem && lastItem !==0){
            lastItem = (isOperator)? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    calc(){

        let last = "";

        this._lastOperator = this.getLastItem();

        if(this._operation.length <3){
            
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length >3){

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if(result.toString().split(".").length > 1){
        
            result = result.toFixed(2);

        }

        if(last == "%"){
            result /= 100;

            this._operation = [result];
        }

        else {
            this._operation = [result];

            if(last!= "") this._operation.push(last);
        }

        this.setLastNumberToDisplay();

    }

    getResult(){

        try{
            return eval(this._operation.join(" "));
        }
        catch(e){
            setTimeout(()=>{
                this.setError();
            },1);
        }
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addDot(){
        
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation("0.");
        }

        else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){

        this.playAudio();

        switch(value){

            case "ac":
                this.clearAll();
                break;

            case "ce":
                this.clearEntry();
                break;

            case "porcentagem":
                this.addOperation("%");
                break;

            case "divisao":
                this.addOperation("/");
                break;

            case "soma":
                this.addOperation("+");
                break;

            case "subtracao":
                this.addOperation("-");
                break;

            case "multiplicacao":
                this.addOperation("*");
                break;

            case "igual":
                this.calc("=");
                break;

            case "ponto":
                this.addDot(",");
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseFloat(value));
                break;
            
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){
      
        let buttons = document.querySelectorAll(".btn");

        buttons.forEach(btn =>{

                this.addEventListenerAll( btn, "click drag", e=>{

                //let textBtn = btn.className;

                this.execBtn(btn.id);

                });

                btn.addEventListener("mouseover", e=>{
                    btn.style.cursor = "pointer";
                });
        });
    }


    get currentDate(){
        return new Date();
    }

    set currentDate (value){
        this._currentDate = value;
    }

    get date(){
        return this._dateEl.innerHTML;
    }

    set date(value){
        this._dateEl.innerHTML = value;
    }

    get time(){
        return this._timeEl.innerHTML;
    }

    set time(value){
        this._timeEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length >10){
            this.setError();
            return;
        }

        this._displayCalcEl.innerHTML = value;
    }
    
}