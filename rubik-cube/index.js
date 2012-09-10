// 注：
//   作成途中です。途中を次々と残していく遊びです。
//
//   デフォルトの日付名でつぎつぎと書いてきたけど、
//   最新が固定のurlを持ってて欲しい気がしてきたので、
//   ここを、そうしてみます。
// 現状：
//   ブロック以外のドラッグで全体回転。
//   ブロックのドラッグで、1列回転。
//   1列回転のアニメーション(タイマーで何コマか掛けて回す)も出来た。
// 　ブロックのドラッグ中の、ちょっと傾くガイド表示ができた。
// 　長いドラッグ(180度)は傾くだけでなく、ぷるぷる震えだす。
//   キューブ虎の巻.html へ向けて、外から呼ぶ用に、
//   　ちゃんとネームスペース的な事、してみた。
//   「ドラッグしたままcanvasを出てマウスアップ」が考慮外というバグに気付いた。 ←今ココ
// 次：
//   コードのリファクタ
//   シャッフル機能

/*
todo: ( * todo / x done / - pending / ● 今ココ )

● 機能
  x キューブの表示
　x キューブ全体の回転
　　(視点移動。ブロック以外(溝も)をドラッグ。ドラッグ中、随時反映)
　x ブロックのドラッグで1列回転
　　(マウスアップで確定して回転、ドラッグの長短で90度/180 度を切り替え)
　　x 1列回転アニメーション
　　x ドラッグ中(マウスアップ前)のガイド
　　　x 予定方向へ対象列だけちょっと傾く
　　　x 180度回転となる長いドラッグになったら、ぷるぷる震えだす
●●●
　* シャッフル
　　ランダムに回転を繰り返す。開始と停止
  * 設定画面？
    7x7x7 とかも出来るようにしてあるので、それを実行時に指定し直せるようにしたい。
    conf = new Conf(space); で、Space, Cube の各プロパティを読んで、
    conf.dump(); //=> 設定情報の文字列 　　で、コメント付きで jsonかなんかとして吐く、
    設定画面というか、全項目が1つの大きなテキスト入力欄で、編集して「適用」ボタン押すと、
    Conf.load(入力欄.data);// => Confオブジェクト Space(), Cube()に渡せるような
    で、もって、space オブジェクトを最作成
    というような感じの
  * 記録・再生機能？
    ある区間の操作を記録して再生できるようにしたら、
    これを図(動画)として、マニュアル(虎の巻)のページが作れる？
    「まず、第1面(白)を揃えます。角のブロックの場合は、これこれこうします。
      では実際に見てみましょう。(下図の再生ボタンを押してください。)」
    みたいな。

* バグ
  * 50msec とか、適当すぎた。実際には、そんな間隔で描ききれてないでしょ。
    → ちゃんと考えてみよう。

● リファクタ
　* "xMinus", "xPlus", "yMinus", ... って、、　どうなのか
　　switchで6ケース列挙してる箇所を、どうにかしたい
  * Cube#rotate() と Space#draw() で、1 列回転の対象ブロックの判定処理が重複してるのを解消
  * 機能が落ち着いたので、全体を見渡して整理。

● ここ(jsdo.it)って、どう使うの？
　●これ、1つのurlで、どんどん修正していくのと、
　　自分でどんどんフォークして いって、未完成の各時点を取っておくのと、
　　どっちが良いのだろう。
　　なんとなく履歴も持っててくれるのかな、と想像してたけど、そんなのは無いのか。> jsdo.it
　　　● ちょっとずつ完成していく様子を取っておきたいというか、
　　　　バグな時点の動作の方が面白いというか、
　　　　別名で次々残していってみます。
      ● でも、最新に対して、固定のurlが欲しい気もする。
        手動で、そういう事にしてみよう。
*/

//名前空間 //●●●
(function(namespace){
  var modules = namespace.split(".");
  var cur = window;
  for(var i = 0; i< modules.length; i++){
    var module = modules[i];
    if(!cur[module]){
      cur[module] = {};
    }
    cur = cur[module];
  }
})("it.jsdo.oxoofo.rubikcube");// ん？ ...イタリア？

(function(){
  var ns = it.jsdo.oxoofo.rubikcube;

  //世界(3次元空間 + キューブ1つ + 2次元へ落とす処理(カメラ)) --------------------
  var Space = ns.Space = function(canvas) {
    this.canvas = canvas;
    this.screenInfo = {
      center: {x: canvas.width / 2, y: canvas.height /2},
      zoomRatio: 0.9
    };
    this.screenInfo.cubeSize = Math.min(canvas.width, canvas.height) *
                               this.screenInfo.zoomRatio / //キューブの最大(対角線)が、画面に対し占める比。
                               Math.sqrt(3); //キューブの対角線に対し、一片は、その 1/√3。
    this.ctx = canvas.getContext("2d");
    this.backgroundColor = 0x808080;
    this.cube = new Cube();//← デフォルトは 3x3x3
    //this.cube = new Cube({n: 7}); //← 指定すれば、7x7x7 もできる
    this.cameraMatrix = Matrix.IDENTITY;
    this.cameraMatrix = Matrix.createRotation(Vector.UNIT_YM, Math.PI / 4).mul(this.cameraMatrix);
    this.cameraMatrix = Matrix.createRotation(Vector.UNIT_XP, Math.PI / 6).mul(this.cameraMatrix);
    this.cameraDistance = 5;//遠近感の計算用

    this.__setEventHandlers();
  };
  Space.prototype.__setEventHandlers = function() {
    var that = this;
    this.canvas.onmousedown = function(e){that.mouseDownListner(e);};
    this.canvas.onmousemove = function(e){that.mouseMoveListner(e);};
    this.canvas.onmouseup = function(e){that.mouseUpListner(e);};
  };
  Space.prototype.draw = function() {
    var infos, info;
    var i;
    var blockGroups;

    //ブロックを描画する順序を決める。
    //各ブロックが同じ大きさ同じ向きの立方体で、しかも格子状に整列している事が幸いして、
    //重ね合わせ問題は、中心点の前後で比較して奥の物から順に描けばクリア。

    //ただ、1列回転アニメーション中やドラッグ中の傾くガイド表示で
    //整列していない場合、これでは済まない。
    //その場合は、回転している列とその前後の3グループに分ける。
    //こうすれば、そのグループ内のブロック同士は、整列している。

    //1列回転アニメーション中(か、どうか。そして、そうなら、その情報)
    var tilt = this.playing;
    if(!tilt){
      //1列ドラッグ中の傾くガイド表示(中か、どうか。そして、そうなら、その情報)
      tilt = Flag.nestedProp(this, "dragging.block.guide.cur");
    }
    if(tilt){
      // tilt に代入した フラグ(?)は、いずれもプロパティ axis,targetRowを持つ
      var axis = tilt.axis[0];
      var targetRow = tilt.targetRow;

      // 対象の軸名に対するcell座標の値(3x3x3キューブなら 0, 1, 2)が、
      // 値として小さい方、大きい方、対象列そのもの、と3グループに分ける。
      // どっちが手前でどっちが奥か、は、また後で決める。
      var groupYoungRows = [];
      var groupTargetRow = [];
      var groupOldRows = [];
      for(i in this.cube.blocks) {
        block = this.cube.blocks[i];
        if(block.cell[axis] < targetRow)       {groupYoungRows.push(block);}
        else if(block.cell[axis] == targetRow) {groupTargetRow.push(block);}
        else                                   {groupOldRows.push(block);}
      }

      // どっちが手前でどっちが奥か
      var axisMinus = Block.getNormalVector(axis + "Minus");
      axisMinus = this.cameraMatrix.mul(axisMinus);
      if (axisMinus.z < 0) {
        blockGroups = [groupOldRows, groupTargetRow, groupYoungRows];
      } else {
        blockGroups = [groupYoungRows, groupTargetRow, groupOldRows];
      }
    } else {
      blockGroups = [this.cube.blocks];
    }

    //背景
    this.ctx.fillStyle = this.__rgba(this.backgroundColor, 1.0);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for(var bgIdx = 0; bgIdx < blockGroups.length; bgIdx++) {
      var blocks = blockGroups[bgIdx];

      //格子状に整列しているブロック同士の描画する順序を決める。
      //中心点の前後で比較して奥の物から順に描けば良い。
      infos = [];
      for(i = 0; i < blocks.length; i++) {
        info = {};
        info.blockIndex = i;
        info.centerZ = this.cameraMatrix.mul(blocks[i].totalMove.mul(blocks[i].center)).z;
        infos.push(info);
      }
      infos.sort(function(info1, info2){
        return info2.centerZ - info1.centerZ;//奥の方(zが大きい方)が先に
      });

      //奥の物から順に描画
      var block, surfaceName, vtxs, vi, j, k;
      for(i = 0; i < infos.length; i++) {
        info = infos[i];
        block = blocks[info.blockIndex];

        //8つの頂点の現在の座標を計算
        vtxs = this.__getCurVertexCoordsOnScreen(block);

        //各面を描画
        for(surfaceName in Block.VERTEX_INDEXES) {
          vi = Block.VERTEX_INDEXES[surfaceName];
          if(!this.__faceToCamera(vtxs, vi)) {
            continue;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(vtxs[vi[3]].x, vtxs[vi[3]].y);
          var color = block.colors[surfaceName];
          this.ctx.fillStyle = this.__rgba(color, 1.0);

          for(k = 0; k < 4; k++) {
            this.ctx.lineTo(vtxs[vi[k]].x, vtxs[vi[k]].y);
          }
          this.ctx.closePath();
          this.ctx.fill();
        }
      }
    }
  };
  Space.prototype.__rgba = function(color, alpha) {
    var rv = [(color & 0xff0000) / 0x10000, (color & 0xff00) / 0x100, color & 0xff, alpha];
    return "rgba(" + rv.join(",") + ")";
  };
  //8つの頂点の現在の座標を計算
  Space.prototype.__getCurVertexCoordsOnScreen = function(block) {
    var matrix = this.cameraMatrix.mul(block.totalMove);
    var vtxs = [];
    for(j = 0; j < 8; j++) {
      vtxs[j] = this.__getCurVertexCoordOnScreen(block.vertexes[j], matrix);
    }
    return vtxs;
  };
  Space.prototype.__getCurVertexCoordOnScreen = function(v, matrix) {
    var scr = this.screenInfo;
    var camDist = this.cameraDistance;

    //初期座標 → 現在座標(+カメラ変換)
    v = matrix.mul(v);

    //遠近感
    //キューブの1辺の大きさが1として(内部座標)、camDist だけ離れた位置から見た感じ。
    v.x = v.x * camDist / (camDist + v.z);//z軸は手前が - 、奥が + なので、足せば良い。
    v.y = v.y * camDist / (camDist + v.z);

    //内部座標→画面座標
    v.x = v.x * scr.cubeSize + scr.center.x;
    v.y = v.y * scr.cubeSize + scr.center.y;

    return v;
  };
  //画面座標へ落としたブロックの1つの面が、こっち向きなのか、向こう向きなのか判定
  Space.prototype.__faceToCamera = function(vertexCoords, vertexIndexes) {
    var cs = vertexCoords, is = vertexIndexes,
        v0 = cs[is[0]], v1 = cs[is[1]], v2 = cs[is[2]];
    return Vector.whichSide(v0, v1, v2) > 0;
  };
  Space.prototype.__rotateCamera = function(matrix) {
    this.cameraMatrix = matrix.mul(this.cameraMatrix);
  };
  Space.prototype.mouseDownListner = function(e) {
    this.dragging = {};
    this.__seekClicked(e);
  };
  Space.prototype.mouseMoveListner = function(e) {
    if(!this.dragging) {return;}

    var x, y, v, d;
    if (this.dragging.whole) {
      //全体回転(視点移動)のドラッグ 随時更新
      x = e.clientX - this.dragging.whole.prevPos.x;
      y = e.clientY - this.dragging.whole.prevPos.y;
      v = new Vector(y, -x, 0);
      d = Math.sqrt(x * x + y * y);
      this.__rotateCamera(Matrix.createRotation(v, Math.PI * d / 200));
      this.dragging.whole.prevPos.x = e.clientX;
      this.dragging.whole.prevPos.y = e.clientY;
    } else if (this.dragging.block) {
      //1列回転のドラッグはマウスアップ時に回転する事が確定
      //ここでは、予定の方向へちょっと傾いてい見せるガイド表示を
      this.__judgeBlockDrag(e);
      var info = this.dragging.block, guide = info.guide,
          prev = guide.prev, cur = guide.cur;
      if(prev){
        if(cur && prev.axis == cur.axis && prev.quad == cur.quad){
          return;
        } else {
          var angle = Space.GUIDE_ANGLE;
          if(guide.cramping){
            if(guide.cramping.odd){
              angle += Space.GUIDE_CRAMP_ANGLE;
            }
            window.clearInterval(guide.cramping.handle);
            delete guide.cramping;
          }
          this.cube.rotate(info.block, prev.rotationAxis, -angle);
        }
      }
      if(cur) {
        this.cube.rotate(info.block, cur.rotationAxis, Space.GUIDE_ANGLE);
        if(cur.quad == 2) {
          var block = info.block;
          var cramping = guide.cramping = {odd: false};
          var rotationAxis = cur.rotationAxis;
          var that = this;
          cramping.draw = function(){
            var angle = Space.GUIDE_CRAMP_ANGLE;
            var pitch = Space.CRAMP_PITCH_2;
            if(cramping.odd){
              angle = -angle;
              pitch = Space.CRAMP_PITCH_1;
            }
            that.cube.rotate(block, rotationAxis, angle);
            that.draw();
            cramping.handle = window.setTimeout(cramping.draw, pitch);
            cramping.odd = !cramping.odd;
          };
          cramping.handle = window.setTimeout(cramping.draw, Space.CRAMP_PITCH_1);
        }
      }
    }
    this.draw();
  };
  Space.prototype.mouseUpListner = function(e) {
    if(this.dragging && this.dragging.block) {
      this.__judgeBlockDrag(e);
      var info = this.dragging.block, guide = info.guide,
          prev = guide.prev, cur = guide.cur;
      if(prev){
        var angle = Space.GUIDE_ANGLE;
        if(guide.cramping){
          if(guide.cramping.odd){
            angle += Space.GUIDE_CRAMP_ANGLE;
          }
          window.clearInterval(guide.cramping.handle);
          delete guide.cramping;
        }
        this.cube.rotate(info.block, prev.rotationAxis, -angle);
      }
      if(cur) {
        var block = info.block;
        var axis = cur.axis;
        var rotationAxis = cur.rotationAxis;
        var quad = cur.quad;
        var quadPerFrame = quad / Space.FRAME_COUNT;
        var timePerFrame = Space.TIME_TO_ROTATE / Space.FRAME_COUNT;
        var frame = 0;
        var that = this;
        this.playing = {};//アニメーション再生中
        this.playing.axis = axis;
        this.playing.targetRow = info.block.cell[axis[0]];
        this.playing.handle = window.setInterval(
          function() {
            if(++frame < Space.FRAME_COUNT) {
              that.cube.rotate(block, rotationAxis, quadPerFrame);
            } else {
              that.cube.rotate(block, rotationAxis, quadPerFrame, quad);
              window.clearInterval(that.playing.handle);
              delete that.playing;
            }
            that.draw();
          }, timePerFrame);
      }
    }
    delete this.dragging;
  };
  //クリックされたのはどのブロックかを判定
  Space.prototype.__seekClicked = function(e) {
    var i,j, block, idxs;
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var clickPos = {x: x, y: y};

    for(i in this.cube.blocks) {
      block = this.cube.blocks[i];

      //8つの頂点の現在の座標を計算
      vtxs = this.__getCurVertexCoordsOnScreen(block);

      for(j in block.clickableFaces) {
        surfaceName = block.clickableFaces[j];
        vi = Block.VERTEX_INDEXES[surfaceName];
        if(!this.__faceToCamera(vtxs, vi)) {
          continue;
        }
        if(this.__contain(vtxs, vi, clickPos)) {
          //1列回転アニメーション中は、新たにブロックのドラッグは開始させない。
          //(全体の回転は許す)
          if(this.playing){
            delete this.dragging;
            return;
          }

          this.dragging.block = {};
          this.__prepareBlockDrag(block, surfaceName, e);
          return;
        }
      }
    }

    //どのブロックでもない → キューブ全体の回転(視点移動)のドラッグ開始
    this.dragging.whole = {prevPos: {x: e.clientX, y:e.clientY}};
  };
  //四辺形と点との内外判定
  Space.prototype.__contain = function(vtxs, vi, pos) {
    for(var i = 0, j = 1; i < 4; i++, j++, j %= 4){
      if(Vector.whichSide(vtxs[vi[i]], vtxs[vi[j]], pos) < 0) {
        return false;
      }
    }
    return true;
  };
  Space.prototype.__prepareBlockDrag = function(block, surfaceName, e) {
    var info = this.dragging.block;
    info.block = block;
    info.surfaceName = surfaceName;
    info.startPos = {x: e.clientX, y: e.clientY};

    var normal = Block.getNormalVector(surfaceName);
    normal = block.totalMove.mul(normal);
    var clickedCubeFace, directions;
    if      (normal.x > 0.9)  {clickedCubeFace = "xPlus";  directions = ["yPlus", "zPlus"];}
    else if (normal.x < -0.9) {clickedCubeFace = "xMinus"; directions = ["yPlus", "zPlus"];}
    else if (normal.y > 0.9)  {clickedCubeFace = "yPlus";  directions = ["xPlus", "zPlus"];}
    else if (normal.y < -0.9) {clickedCubeFace = "yMinus"; directions = ["xPlus", "zPlus"];}
    else if (normal.z > 0.9)  {clickedCubeFace = "zPlus";  directions = ["xPlus", "yPlus"];}
    else if (normal.z < -0.9) {clickedCubeFace = "zMinus"; directions = ["xPlus", "yPlus"];}
    else                      {throw new Error("?");}
    info.clickedCubeFace = clickedCubeFace;

    var matrix = this.cameraMatrix;
    var vc = block.center;
    vc = block.totalMove.mul(vc);
    var v = [vc.add(Block.getNormalVector(directions[0])),
             vc.add(Block.getNormalVector(directions[1]))];

    vc = this.__getCurVertexCoordOnScreen(vc, matrix);
    for (var i = 0; i < 2; i++) {
      v[i] = this.__getCurVertexCoordOnScreen(v[i],  matrix);
      v[i] = v[i].sub(vc);
      var len = Math.sqrt(v[i].x * v[i].x + v[i].y * v[i].y);
      v[i].x /= len;
      v[i].y /= len;
    }
    var litmusPlusMinus = v[0].add(v[1]);
    var litmusXYZ = v[0].sub(v[1]);
    directions[2] =  directions[1][0] + "Minus";
    directions[3] =  directions[0][0] + "Minus";

    info.judgeDragDirection = function(dx, dy){
      var idx = litmusPlusMinus.x * dx + litmusPlusMinus.y * dy > 0 ? 0 : 2;
      idx += litmusXYZ.x * dx + litmusXYZ.y * dy > 0 ? 0 : 1;
      return directions[idx];
    };
  };
  Space.prototype.__judgeBlockDrag = function(e) {
    var info = this.dragging.block;
    var dx = e.clientX - info.startPos.x,
        dy = e.clientY - info.startPos.y,
        d = Math.sqrt(dx * dx + dy * dy);
    if(!info.guide){ info.guide = {};}
    info.guide.prev = info.guide.cur;

    if(d >= Space.TRIGGER_ROTATE90) {
      info.guide.cur = {};

      var cur = info.guide.cur;
      var block = info.block;
      var clickedCubeFace = info.clickedCubeFace;
      var direction = info.judgeDragDirection(dx, dy);
      var vc = Block.getNormalVector(clickedCubeFace);
      var vd = Block.getNormalVector(direction);
      cur.rotationAxis = Vector.outerProduct(vc, vd);
      cur.axis = Vector.getUnitVectorName(cur.rotationAxis);
      cur.quad = d >= Space.TRIGGER_ROTATE180 ? 2 : 1;
      cur.targetRow = block.cell[cur.axis[0]];
    } else {
      delete info.guide.cur;
    }
  };
  Space.TRIGGER_ROTATE90 = 10;
  Space.TRIGGER_ROTATE180 = 80;
  Space.FRAME_COUNT = 5;
  Space.GUIDE_ANGLE = Math.PI / 30;
  Space.TIME_TO_ROTATE = 500;
  Space.GUIDE_CRAMP_ANGLE = Math.PI / 300;
  //Space.CRAMP_PITCH = 50;
  Space.CRAMP_PITCH_1 = 80;
  Space.CRAMP_PITCH_2 = 20;

  // ルービックキューブ ----------------------------------------------------------
  var Cube = ns.Cube = function(info) {
    if(!info){info = {};}
    var n = info.n || 3;
    this.n = n;
    this.blocks = [];
    var edge = 1 / this.n;
    var gap_ratio = info.gap_ratio || 0.1;
    var gap = edge * gap_ratio;
    edge -= gap;
    var cubeColors = info.colors || {
      xMinus: 0xFFFF00,
      xPlus:  0x00AA00,
      yMinus: 0xFFFFFF,
      yPlus:  0x0000AA,
      zMinus: 0xFF0000,
      zPlus:  0xBB5500,
      inner:  0x000000
    };
    var ix,iy,iz, blockInfo = {edge: edge, n: n}, xIn,yIn,zIn;
    for(ix = 0; ix < n; ix++) {
      for(iy = 0; iy < n; iy++) {
        for(iz = 0; iz < n; iz++) {
          if (ix > 0 && ix < n-1 && iy > 0 && iy < n-1 && iz > 0 && iz < n-1) {
            continue;
          }

          blockInfo.cell = new Vector(ix, iy, iz);
          blockInfo.pos = new Vector((ix + 0.5)/n - 0.5, (iy + 0.5)/n - 0.5, (iz + 0.5)/n - 0.5);
          blockInfo.colors = {
            xMinus: ix === 0 ? cubeColors.xMinus : cubeColors.inner,
            xPlus: ix === n - 1 ? cubeColors.xPlus : cubeColors.inner,
            yMinus: iy === 0 ? cubeColors.yMinus : cubeColors.inner,
            yPlus: iy === n - 1 ? cubeColors.yPlus : cubeColors.inner,
            zMinus: iz === 0 ? cubeColors.zMinus : cubeColors.inner,
            zPlus: iz === n - 1 ? cubeColors.zPlus : cubeColors.inner
          };

          this.blocks.push(new Block(blockInfo));
        }
      }
    }
  };
  Cube.prototype.rotate = function(block, rotationAxis, quad, quadForCell){
    var mx = Matrix.createRotation(rotationAxis, quad * Math.PI / 2);
    if(quadForCell){
      var mx2 = Matrix.createRotation(rotationAxis, quadForCell * Math.PI / 2);
      var mxForCell = this.__createShiftedRotation(mx2, rotationAxis);
    }

    var condPropName = Vector.getUnitVectorName(rotationAxis)[0];

    var condValue = block.cell[condPropName];
    var isTarget = function(block) {
      return block.cell[condPropName] == condValue;
    };

    for(var i in this.blocks){
      b = this.blocks[i];
      if(!isTarget(b)){continue;}
      // 描画用の、移動の累積を表す行列に、今回の回転分を"加算"(積算)
      // 描画用なので、アニメーションの各コマごとに計算する
      b.totalMove = mx.mul(b.totalMove);

      if(quadForCell){
        // 位置把握用の区画座標に、今回の回転を作用させる
        // 描画用ではないので、アニメーションの各コマでは行わず、
        // 最後に全コマ分の回転を一気に行う
        b.cell = mxForCell.mul(b.cell).integerize();
      }
    }
  };
  Cube.prototype.__createShiftedRotation = function(mx, rotationAxis) {
    var p = Vector.restAxisNames(Vector.getUnitVectorName(rotationAxis)[0]);
    var v1 = new Vector(0, 0, 0), v2 = new Vector(0, 0, 0);
    var offset = (this.n - 1) / 2;
    v1[p[0]] = v1[p[1]] = -offset;
    v2[p[0]] = v2[p[1]] = offset;
    var s1 = Matrix.createParallelMovement(v1), s2 = Matrix.createParallelMovement(v2);
    return s2.mul(mx.mul(s1));
    //↑「行列の積演算の結合律」から、s2.mul(mx).mul(s1) でも良いのだけど、
    //  意味的な順序に合わせた。雰囲気、大事。「s1して、mxして、s2する」
  };

  // キューブを構成する各ブロック ------------------------------------------------
  var Block = function(info) {
    //cell: このブロックが現在キューブ内のどの位置に居るか。整数座標。
    // キューブの1列を回転させる時、どのブロックが対象かの判定に使う。
    var cell = info.cell;
    this.cell = cell;
    this.colors = info.colors; //このブロックの各面の色。内部側にもグレーの色がつく。
    this.center = info.pos; //このブロックの重心の初期状態での空間座標
    //vertexes: このブロックの8つの頂点の初期状態での空間座標
    var half = info.edge / 2;
    var xm = info.pos.x - half, xp = info.pos.x + half,
        ym = info.pos.y - half, yp = info.pos.y + half,
        zm = info.pos.z - half, zp = info.pos.z + half;
    this.vertexes = [new Vector(xm, ym, zm), new Vector(xm, ym, zp),
                     new Vector(xm, yp, zm), new Vector(xm, yp, zp),
                     new Vector(xp, ym, zm), new Vector(xp, ym, zp),
                     new Vector(xp, yp, zm), new Vector(xp, yp, zp)];
    //totalMove: このブロックが受けた回転・移動の行列の積算(の行列)。
    // 初期状態の空間座標にこれを掛けると、現在の空間座標が出る。
    // これに積算されるのは、キューブの1列回転による回転・移動。
    // キューブ全体を回すのは、Space#cameraMatrix の方へ積算されるので、これとは別。
    this.totalMove = Matrix.IDENTITY;
    this.clickableFaces = [];
    var n = info.n;
    if(cell.x === 0) {this.clickableFaces.push("xMinus");}
    if(cell.x === n - 1) {this.clickableFaces.push("xPlus");}
    if(cell.y === 0) {this.clickableFaces.push("yMinus");}
    if(cell.y === n - 1) {this.clickableFaces.push("yPlus");}
    if(cell.z === 0) {this.clickableFaces.push("zMinus");}
    if(cell.z === n - 1) {this.clickableFaces.push("zPlus");}
  };
  //VERTEX_INDEXES: ブロック各面に対して、その面に属する4つ頂点の、vertexesでのインデックス
  // ブロックの外側からその面を見た時に、時計回り(*1)
  //    *1) 時計回りかどうかは、3次元座標系のx,y,z 3つの軸の相互の関係による。
  //    ここで考えている座標系は、画面左から右へ=x+, 画面上から下へ=y+ , 画面手前から奥へ=z+
  Block.VERTEX_INDEXES = {
    xMinus: [0,2,3,1], xPlus: [4,5,7,6],
    yMinus: [0,1,5,4], yPlus: [2,6,7,3],
    zMinus: [0,4,6,2], zPlus: [1,3,7,5]
  };
  Block.getNormalVector = function(surfaceName) {
    switch(surfaceName) {
    case "xMinus": return Vector.UNIT_XM;
    case "xPlus": return Vector.UNIT_XP;
    case "yMinus": return Vector.UNIT_YM;
    case "yPlus": return Vector.UNIT_YP;
    case "zMinus": return Vector.UNIT_ZM;
    case "zPlus": return Vector.UNIT_ZP;
    default : throw new Error("invalid surfaceName");
    }
  };

  // ベクトル、3次元座標 (2次元座標としても使う) ---------------------------------
  var Vector = function(x, y, z){this.x = x; this.y = y; this.z = z;};
  Vector.UNIT_XP = new Vector(1,0,0); Vector.UNIT_XM = new Vector(-1,0,0);
  Vector.UNIT_YP = new Vector(0,1,0); Vector.UNIT_YM = new Vector(0,-1,0);
  Vector.UNIT_ZP = new Vector(0,0,1); Vector.UNIT_ZM = new Vector(0,0,-1);
  Vector.prototype.toString = function() {
    return "{x:" + this.x + ", y:" + this.y + ", z:" + this.z + "}";
  };
  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  };
  Vector.prototype.sub = function(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  };
  Vector.prototype.integerize = function() {//破壊的。自身を変更。
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
};
  //3 つの2次元ベクトルの位置関係の判定
  // ベクトル v0-v1 の法線ベクトルと ベクトルv1-v2の内積を返す。
  //v0,v1を通る直線に対して、v2がどちらの側に居るか(または直線上か)の判定になる。
  //v0からv1の方へ向いて v2が直線の右側なら、正の値が返る。左側なら負の値が、直線上なら0が、返る。
  Vector.whichSide = function(v0, v1, v2) {
    return (v0.y - v1.y) * (v2.x - v1.x) + (v1.x - v0.x) * (v2.y - v1.y);
};
  //外積
  Vector.outerProduct = function(a, b){
    return new Vector(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
  };
  Vector.restAxisNames = function(a1, a2) {
    var cands = ["x", "y", "z"];//candidates
    var restNames = [];
    for (var i in cands) {
      var cand = cands[i];
      if(cand != a1 && cand != a2){
        restNames.push(cand);
      }
    }
    return restNames;
  };
  Vector.getUnitVectorName = function(v) {
    switch(v.toString()) {
    case "{x:-1, y:0, z:0}": return "xMinus";
    case "{x:1, y:0, z:0}": return "xPlus";
    case "{x:0, y:-1, z:0}": return "yMinus";
    case "{x:0, y:1, z:0}": return "yPlus";
    case "{x:0, y:0, z:-1}": return "zMinus";
    case "{x:0, y:0, z:1}": return "zPlus";
    default: throw new Error("invalid vector");
    }
  };

  // 3x4行列(ベクトルの回転や移動を表す) -----------------------------------------
  var Matrix = function(m00, m01, m02, m03,
                        m10, m11, m12, m13,
                        m20, m21, m22, m23) {
    this.m = [[m00, m01, m02, m03],
              [m10, m11, m12, m13],
              [m20, m21, m22, m23]];
  };
  Matrix.IDENTITY = new Matrix(1,0,0,0, 0,1,0,0, 0,0,1,0);
  Matrix.createRotation = function(axis, theta) {
    var v = axis, d = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    var x = v.x / d, y = v.y / d, z = v.z / d;
    var s = Math.sin(theta), c = Math.cos(theta), r = 1 - c;
    var xs = x * s, ys = y * s, zs = z * s;
    var xr = x * r, xyr = xr * y, xzr = xr * z, x2r = xr * x;
    var yr = y * r, y2r = yr * y, yzr = yr * z, z2r = z * z * r;

    return new Matrix(x2r + c,  xyr - zs, xzr + ys, 0,
                      xyr + zs, y2r + c,  yzr - xs, 0,
                      xzr - ys, yzr + xs, z2r + c,  0);
  };
  Matrix.createParallelMovement = function(offset) {
    return new Matrix(1, 0, 0, offset.x,
                      0, 1, 0, offset.y,
                      0, 0, 1, offset.z);
  };
  Matrix.prototype.mul = function(o){
    var m1, m2, m, v;
    if(o instanceof Matrix) {
      m1 = this.m;
      m2 = o.m;
      return new Matrix(
        m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0],
        m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1],
        m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2],
        m1[0][0] * m2[0][3] + m1[0][1] * m2[1][3] + m1[0][2] * m2[2][3] + m1[0][3],
        m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0],
        m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1],
        m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2],
        m1[1][0] * m2[0][3] + m1[1][1] * m2[1][3] + m1[1][2] * m2[2][3] + m1[1][3],
        m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0],
        m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1],
        m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2],
        m1[2][0] * m2[0][3] + m1[2][1] * m2[1][3] + m1[2][2] * m2[2][3] + m1[2][3]);
    } else if (o instanceof Vector || (o instanceof Object && "x" in o && "y" in o && "z" in o)) {
      m = this.m;
      v = o;
      return new Vector(
        m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3],
        m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3],
        m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3]);
    }
    else {
      throw new Error("Matrix#mul(o): 引数o は Matrix か Vector のみ。(Vectorっぽい も可)");
    }
  };

  var Flag = {};
  Flag.nestedProp = function(obj, propNest){
    var props = propNest.split('.');
    var curObj = obj, prop;
    for(var i = 0; i < props.length; i++){
      if(!curObj){break;}
      prop = props[i];
      curObj = curObj[prop];
    }
    return curObj;
  };
})();

/*
参考にしたサイト:

http://d.hatena.ne.jp/uupaa/20080217/1203232559
 * cancas(2d)で立方体の表示(自前3d→2d変換)、
 * アニメーションは window.setInterval(funcFoo);
 (というか、この記事にあるhtmlそのものを元にして、ちょっとずつ
  改造して来たので、その他いろいろ)

http://www.akibahideki.com/blog/html5-canvas/canvas3.html
 * canvas のマウスイベントハンドラ設定は canvas.onmousexxx = funcFoo;

読んだ(読んでる)本:

JavaScript: The Good Parts ―「良いパーツ」によるベストプラクティス
http://www.amazon.co.jp/JavaScript-3a-Parts-%E2%80%95%E3%80%8C%E8%89%AF%E3%81%84%E3%83%91%E3%83%BC%E3%83%84%E3%80%8D%E3%81%AB%E3%82%88%E3%82%8B%E3%83%99%E3%82%B9%E3%83%88%E3%83%97%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%82%B9-Douglas-Crockford/dp/4873113911

O'Reilly/JavaScript 第5版
http://www.oreilly.co.jp/books/9784873113296/
*/
