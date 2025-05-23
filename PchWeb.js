const a="これはJSです。";
alert("THIS IS POP-UP");

//WebGLの記述
document.addEventListener('DOMContentLoaded', function(){

    //HTMLから"canvas"を受けとる
    const canvas=document.getElementById('canvas');

    //canvas要素からWebGLコンテキストを受けとる
    const gl=canvas.getContext('webgl');

    //WebGL非対応デバイスのためのチェック
    if(!gl){
        alert('webgl not supported.');
        return;
    }

    //色の初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //RGBA

    //画面の初期化
    // 次の描画が正常にできるようにする
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ”プログラム”のオブジェクト作成
    //Primitives(プリミティブ形状)の作成
    const program=gl.createProgram();

    //シェーダーのソースを取得
    const vertexShaderSource=document.getElementById('vertexShader').textContent;
    const fragmentShaderSource=document.getElementById('fragmentShader').textContent;

    //シェーダーをコンパイル
    //これを”プログラム”にシェーダーを割り当てる
    const vertexShader=gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);
    const fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    //シェーダーをリンクする
    gl.linkProgram(program);

    //プログラムを有効化
    gl.useProgram(program);

    // 頂点座標を定義
    const triangleVertexPosition=[  //角かっこを使うところに注意 
        0.0, 0.8, 0.0, //xyzの順番で|-1.0～1.0|（canvasの真ん中が座標0.0）
        -0.8, -0.8, 0.0,
        0.8, -0.8, 0.0 //3方向ｘ３頂点
    ];

    //頂点バッファを作成
    //GPUとの更新開始
    const triangleVertexBuffer=gl.createBuffer();
    //頂点バッファをバインド
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    //頂点バッファに頂点データを落とす
    //GPUに送る
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertexPosition), gl.STATIC_DRAW);
    
    //頂点データを受け取る皿を作成
    //CPUに送る
    const positionLocation=gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    //変数の型を指定する
    //プログラムバッファー内は一次元バイナリのため、ポインターで型を指定してあげる
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    //vertexAttribPointer　めも(むずかしいから覚える。。)
    //第一引数：プログラムオブジェクト、第二引数：size（頂点ごとに消費する配列要素数を指定）、第三引数：type(各要素の型を指定）、
    // 第四引数：normalized（ノーマル：整数値を浮動小数点に変換するときに値の範囲が-1.0～1.0を正規化するか否か）、第五引数：stride
    // (interleave:複数の異なる要素を交互に配置　している場合のみ、1頂点あたりの使用バイト数を指定)、第六引数：offset(要素が始まるオフセット位置の設定)

    //描画する（最後に）
    //GPU～CPU間の通信工数が減って効率的
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.flush();
    
});