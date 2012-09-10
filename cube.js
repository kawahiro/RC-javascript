//キューブの色(配列にする必要はないかも)
var blue   = {b0:'blue.gif', b1:'blue.gif', b2:'blue.gif', b3:'blue.gif', b4:'blue.gif', b5:'blue.gif', b6:'blue.gif', b7:'blue.gif', b8:'blue.gif'};
var red    = {r0:'red.gif', r1:'red.gif', r2:'red.gif', r3:'red.gif', r4:'red.gif', r5:'red.gif', r6:'red.gif', r7:'red.gif', r8:'red.gif'};
var green  = {g0:'green.gif', g1:'green.gif', g2:'green.gif', g3:'green.gif', g4:'green.gif', g5:'green.gif', g6:'green.gif', g7:'green.gif', g8:'green.gif'};
var orange = {o0:'orange.gif', o1:'orange.gif', o2:'orange.gif', o3:'orange.gif', o4:'orange.gif', o5:'orange.gif', o6:'orange.gif', o7:'orange.gif', o8:'orange.gif'};
var yellow = {y0:'yellow.gif', y1:'yellow.gif', y2:'yellow.gif', y3:'yellow.gif', y4:'yellow.gif', y5:'yellow.gif', y6:'yellow.gif', y7:'yellow.gif', y8:'yellow.gif'};
var white  = {w0:'white.gif', w1:'white.gif', w2:'white.gif', w3:'white.gif', w4:'white.gif', w5:'white.gif', w6:'white.gif', w7:'white.gif', w8:'white.gif'};

//キューブ各面の配列
var A = [  blue.b0, blue.b1, blue.b2,
		   blue.b3, blue.b4, blue.b5,
		   blue.b6, blue.b7, blue.b8];
var B = [  red.r0, red.r1, red.r2,
		   red.r3, red.r4, red.r5,
		   red.r6, red.r7, red.r8];
var C = [  green.g0, green.g1, green.g2,
		   green.g3, green.g4, green.g5,
		   green.g6, green.g7, green.g8];
var D = [  orange.o0, orange.o1, orange.o2,
		   orange.o3, orange.o4, orange.o5,
		   orange.o6, orange.o7, orange.o8];
var E = [  yellow.y0, yellow.y1, yellow.y2,
		   yellow.y3, yellow.y4, yellow.y5,
		   yellow.y6, yellow.y7, yellow.y8];
var F = [  white.w0, white.w1, white.w2,
		   white.w3, white.w4, white.w5,
		   white.w6, white.w7, white.w8];


//キューブの面を"時計回り"に回転させる
function RotationTop(top){
	var oldtop = [];
	for(var i=0; i<9; i++){
	oldtop[i] = top[i];
	}
	
	top[0] = oldtop[6];
	top[2] = oldtop[0];
	top[6] = oldtop[8];
	top[8] = oldtop[2];
	
	top[1] = oldtop[3];
	top[3] = oldtop[7];
	top[5] = oldtop[1];
	top[7] = oldtop[5];
	
	top[4] = oldtop[4];
	
}
//キューブの面を"反時計回り"に回転させる
function ReverseRotationTop(top){
	var oldtop = [];
	for(var i=0; i<9; i++){
		oldtop[i] = top[i];
	}
	
	top[0] = oldtop[2];
	top[2] = oldtop[8];
	top[6] = oldtop[0];
	top[8] = oldtop[6];
	
	top[1] = oldtop[5];
	top[3] = oldtop[1];
	top[5] = oldtop[7];
	top[7] = oldtop[3];
	
	top[4] = oldtop[4];
	
}

//キューブのラインを"時計回り"に回転させる
function RotationSide( side0, side1, side2, side3){
	var oldside = [];
	oldside[0] = side0[0];
	oldside[1] = side0[1];
	oldside[2] = side0[2];
	oldside[3] = side1[0];
	oldside[4] = side1[1];
	oldside[5] = side1[2];
	oldside[6] = side2[0];
	oldside[7] = side2[1];
	oldside[8] = side2[2];
	oldside[9] = side3[0];
	oldside[10] = side3[1];
	oldside[11] = side3[2];
	
	side0[0] = oldside[3];
	side0[1] = oldside[4];
	side0[2] = oldside[5];
	side1[0] = oldside[6];
	side1[1] = oldside[7];
	side1[2] = oldside[8];
	side2[0] = oldside[9];
	side2[1] = oldside[10];
	side2[2] = oldside[11];
	side3[0] = oldside[0];
	side3[1] = oldside[1];
	side3[2] = oldside[2];
	
	return [side0,side1,side2,side3];
}
//キューブのラインを"反時計回り"に回転させる
function ReverseRotationSide( side0, side1, side2, side3){
	var oldside = [];
	oldside[0] = side0[0];
	oldside[1] = side0[1];
	oldside[2] = side0[2];
	oldside[3] = side1[0];
	oldside[4] = side1[1];
	oldside[5] = side1[2];
	oldside[6] = side2[0];
	oldside[7] = side2[1];
	oldside[8] = side2[2];
	oldside[9] = side3[0];
	oldside[10] = side3[1];
	oldside[11] = side3[2];
	
	side0[0] = oldside[9];
	side0[1] = oldside[10];
	side0[2] = oldside[11];
	side1[0] = oldside[0];
	side1[1] = oldside[1];
	side1[2] = oldside[2];
	side2[0] = oldside[3];
	side2[1] = oldside[4];
	side2[2] = oldside[5];
	side3[0] = oldside[6];
	side3[1] = oldside[7];
	side3[2] = oldside[8];
	
	return [side0,side1,side2,side3];
}

//A面:時計回り
function Rotation_A(){
	RotationTop(A);
	var Bs = [B[0],B[1],B[2]];
	var Cs = [C[0],C[1],C[2]];
	var Ds = [D[0],D[1],D[2]];
	var Es = [E[0],E[1],E[2]];
	var r = RotationSide( Bs,Cs,Ds,Es);

	B[0] = r[0][0];
	B[1] = r[0][1];
	B[2] = r[0][2];
	C[0] = r[1][0];
	C[1] = r[1][1];
	C[2] = r[1][2];
	D[0] = r[2][0];
	D[1] = r[2][1];
	D[2] = r[2][2];
	E[0] = r[3][0];
	E[1] = r[3][1];
	E[2] = r[3][2];
	
	viewCube();
	viewOpenCube();
	}
//A面:反時計回り
function ReverseRotation_A(){
	ReverseRotationTop(A);
	var Bs = [B[0],B[1],B[2]];
	var Cs = [C[0],C[1],C[2]];
	var Ds = [D[0],D[1],D[2]];
	var Es = [E[0],E[1],E[2]];
	var r = ReverseRotationSide( Bs,Cs,Ds,Es);
	
	B[0] = r[0][0];
	B[1] = r[0][1];
	B[2] = r[0][2];
	C[0] = r[1][0];
	C[1] = r[1][1];
	C[2] = r[1][2];
	D[0] = r[2][0];
	D[1] = r[2][1];
	D[2] = r[2][2];
	E[0] = r[3][0];
	E[1] = r[3][1];
	E[2] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//A面とF面の間:時計回り
function Rotation_A_F(){
	var Bs = [B[3],B[4],B[5]];
	var Cs = [C[3],C[4],C[5]];
	var Ds = [D[3],D[4],D[5]];
	var Es = [E[3],E[4],E[5]];
	var r = RotationSide( Bs,Cs,Ds,Es);
	
	B[3] = r[0][0];
	B[4] = r[0][1];
	B[5] = r[0][2];
	C[3] = r[1][0];
	C[4] = r[1][1];
	C[5] = r[1][2];
	D[3] = r[2][0];
	D[4] = r[2][1];
	D[5] = r[2][2];
	E[3] = r[3][0];
	E[4] = r[3][1];
	E[5] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//A面とF面の間:反時計回り
function ReverseRotation_A_F(){
	var Bs = [B[3],B[4],B[5]];
	var Cs = [C[3],C[4],C[5]];
	var Ds = [D[3],D[4],D[5]];
	var Es = [E[3],E[4],E[5]];
	var r = ReverseRotationSide( Bs,Cs,Ds,Es);
	
	B[3] = r[0][0];
	B[4] = r[0][1];
	B[5] = r[0][2];
	C[3] = r[1][0];
	C[4] = r[1][1];
	C[5] = r[1][2];
	D[3] = r[2][0];
	D[4] = r[2][1];
	D[5] = r[2][2];
	E[3] = r[3][0];
	E[4] = r[3][1];
	E[5] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//F面:(A面から見て)時計回り
function Rotation_F(){
	RotationTop(F);
	var Bs = [B[6],B[7],B[8]];
	var Cs = [C[6],C[7],C[8]];
	var Ds = [D[6],D[7],D[8]];
	var Es = [E[6],E[7],E[8]];
	var r = RotationSide( Bs,Cs,Ds,Es);
	
	B[6] = r[0][0];
	B[7] = r[0][1];
	B[8] = r[0][2];
	C[6] = r[1][0];
	C[7] = r[1][1];
	C[8] = r[1][2];
	D[6] = r[2][0];
	D[7] = r[2][1];
	D[8] = r[2][2];
	E[6] = r[3][0];
	E[7] = r[3][1];
	E[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//F面:(A面から見て)反時計回り
function ReverseRotation_F(){
	ReverseRotationTop(F);
	var Bs = [B[6],B[7],B[8]];
	var Cs = [C[6],C[7],C[8]];
	var Ds = [D[6],D[7],D[8]];
	var Es = [E[6],E[7],E[8]];
	var r = ReverseRotationSide( Bs,Cs,Ds,Es);
	
	B[6] = r[0][0];
	B[7] = r[0][1];
	B[8] = r[0][2];
	C[6] = r[1][0];
	C[7] = r[1][1];
	C[8] = r[1][2];
	D[6] = r[2][0];
	D[7] = r[2][1];
	D[8] = r[2][2];
	E[6] = r[3][0];
	E[7] = r[3][1];
	E[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//B面:時計回り
function Rotation_B(){
	RotationTop(B);
	var Fs = [F[6],F[7],F[8]];
	var Cs = [C[6],C[3],C[0]];
	var As = [A[8],A[7],A[6]];
	var Es = [E[2],E[5],E[8]];
	var r = RotationSide( Fs,Cs,As,Es);
	
	F[6] = r[0][0];
	F[7] = r[0][1];
	F[8] = r[0][2];
	C[6] = r[1][0];
	C[3] = r[1][1];
	C[0] = r[1][2];
	A[8] = r[2][0];
	A[7] = r[2][1];
	A[6] = r[2][2];
	E[2] = r[3][0];
	E[5] = r[3][1];
	E[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//B面:反時計回り
function ReverseRotation_B(){
	ReverseRotationTop(B);
	var Fs = [F[6],F[7],F[8]];
	var Cs = [C[6],C[3],C[0]];
	var As = [A[8],A[7],A[6]];
	var Es = [E[2],E[5],E[8]];
	var r = ReverseRotationSide( Fs,Cs,As,Es);
	
	F[6] = r[0][0];
	F[7] = r[0][1];
	F[8] = r[0][2];
	C[6] = r[1][0];
	C[3] = r[1][1];
	C[0] = r[1][2];
	A[8] = r[2][0];
	A[7] = r[2][1];
	A[6] = r[2][2];
	E[2] = r[3][0];
	E[5] = r[3][1];
	E[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//B面とD面の間:時計回り
function Rotation_B_D(){
	var Fs = [F[3],F[4],F[5]];
	var Cs = [C[7],C[4],C[1]];
	var As = [A[5],A[4],A[3]];
	var Es = [E[1],E[4],E[7]];
	var r = RotationSide( Fs,Cs,As,Es);
	
	F[3] = r[0][0];
	F[4] = r[0][1];
	F[5] = r[0][2];
	C[7] = r[1][0];
	C[4] = r[1][1];
	C[1] = r[1][2];
	A[5] = r[2][0];
	A[4] = r[2][1];
	A[3] = r[2][2];
	E[1] = r[3][0];
	E[4] = r[3][1];
	E[7] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//B面とD面の間:反時計回り
function ReverseRotation_B_D(){
	var Fs = [F[3],F[4],F[5]];
	var Cs = [C[7],C[4],C[1]];
	var As = [A[5],A[4],A[3]];
	var Es = [E[1],E[4],E[7]];
	var r = ReverseRotationSide( Fs,Cs,As,Es);
	
	F[3] = r[0][0];
	F[4] = r[0][1];
	F[5] = r[0][2];
	C[7] = r[1][0];
	C[4] = r[1][1];
	C[1] = r[1][2];
	A[5] = r[2][0];
	A[4] = r[2][1];
	A[3] = r[2][2];
	E[1] = r[3][0];
	E[4] = r[3][1];
	E[7] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//D面:(B面から見て)時計回り
function Rotation_D(){
	ReverseRotationTop(D);
	var Fs = [F[0],F[1],F[2]];
	var Cs = [C[8],C[5],C[2]];
	var As = [A[2],A[1],A[0]];
	var Es = [E[0],E[3],E[6]];
	var r = RotationSide( Fs,Cs,As,Es);
	
	F[0] = r[0][0];
	F[1] = r[0][1];
	F[2] = r[0][2];
	C[8] = r[1][0];
	C[5] = r[1][1];
	C[2] = r[1][2];
	A[2] = r[2][0];
	A[1] = r[2][1];
	A[0] = r[2][2];
	E[0] = r[3][0];
	E[3] = r[3][1];
	E[6] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//D面:(B面から見て)反時計回り
function ReverseRotation_D(){
	RotationTop(D);
	var Fs = [F[0],F[1],F[2]];
	var Cs = [C[8],C[5],C[2]];
	var As = [A[2],A[1],A[0]];
	var Es = [E[0],E[3],E[6]];
	var r = ReverseRotationSide( Fs,Cs,As,Es);
	
	F[0] = r[0][0];
	F[1] = r[0][1];
	F[2] = r[0][2];
	C[8] = r[1][0];
	C[5] = r[1][1];
	C[2] = r[1][2];
	A[2] = r[2][0];
	A[1] = r[2][1];
	A[0] = r[2][2];
	E[0] = r[3][0];
	E[3] = r[3][1];
	E[6] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//C面:時計回り
function Rotation_C(){
	RotationTop(C);
	var Fs = [F[8],F[5],F[2]];
	var Ds = [D[6],D[3],D[0]];
	var As = [A[2],A[5],A[8]];
	var Bs = [B[2],B[5],B[8]];
	var r = RotationSide( Fs,Ds,As,Bs);
	
	F[8] = r[0][0];
	F[5] = r[0][1];
	F[2] = r[0][2];
	D[6] = r[1][0];
	D[3] = r[1][1];
	D[0] = r[1][2];
	A[2] = r[2][0];
	A[5] = r[2][1];
	A[8] = r[2][2];
	B[2] = r[3][0];
	B[5] = r[3][1];
	B[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//C面:反時計回り
function ReverseRotation_C(){
	ReverseRotationTop(C);
	var Fs = [F[8],F[5],F[2]];
	var Ds = [D[6],D[3],D[0]];
	var As = [A[2],A[5],A[8]];
	var Bs = [B[2],B[5],B[8]];
	var r = ReverseRotationSide( Fs,Ds,As,Bs);
	
	F[8] = r[0][0];
	F[5] = r[0][1];
	F[2] = r[0][2];
	D[6] = r[1][0];
	D[3] = r[1][1];
	D[0] = r[1][2];
	A[2] = r[2][0];
	A[5] = r[2][1];
	A[8] = r[2][2];
	B[2] = r[3][0];
	B[5] = r[3][1];
	B[8] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//C面とE面の間:時計回り
function Rotation_C_E(){
	var Fs = [F[7],F[4],F[1]];
	var Ds = [D[7],D[4],D[1]];
	var As = [A[1],A[4],A[7]];
	var Bs = [B[1],B[4],B[7]];
	var r = RotationSide( Fs,Ds,As,Bs);
	
	F[7] = r[0][0];
	F[4] = r[0][1];
	F[1] = r[0][2];
	D[7] = r[1][0];
	D[4] = r[1][1];
	D[1] = r[1][2];
	A[1] = r[2][0];
	A[4] = r[2][1];
	A[7] = r[2][2];
	B[1] = r[3][0];
	B[4] = r[3][1];
	B[7] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//C面とE面の間:反時計回り
function ReverseRotation_C_E(){
	var Fs = [F[7],F[4],F[1]];
	var Ds = [D[7],D[4],D[1]];
	var As = [A[1],A[4],A[7]];
	var Bs = [B[1],B[4],B[7]];
	var r = ReverseRotationSide( Fs,Ds,As,Bs);
	
	F[7] = r[0][0];
	F[4] = r[0][1];
	F[1] = r[0][2];
	D[7] = r[1][0];
	D[4] = r[1][1];
	D[1] = r[1][2];
	A[1] = r[2][0];
	A[4] = r[2][1];
	A[7] = r[2][2];
	B[1] = r[3][0];
	B[4] = r[3][1];
	B[7] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//E面:(C面から見て)時計回り
function Rotation_E(){
	ReverseRotationTop(E);
	var Fs = [F[6],F[3],F[0]];
	var Ds = [D[8],D[5],D[2]];
	var As = [A[0],A[3],A[6]];
	var Bs = [B[0],B[3],B[6]];
	var r = RotationSide( Fs,Ds,As,Bs);
	
	F[6] = r[0][0];
	F[3] = r[0][1];
	F[0] = r[0][2];
	D[8] = r[1][0];
	D[5] = r[1][1];
	D[2] = r[1][2];
	A[0] = r[2][0];
	A[3] = r[2][1];
	A[6] = r[2][2];
	B[0] = r[3][0];
	B[3] = r[3][1];
	B[6] = r[3][2];
	
	viewCube();
	viewOpenCube();
}
//E面:(C面から見て)時計回り
function ReverseRotation_E(){
	RotationTop(E);
	var Fs = [F[6],F[3],F[0]];
	var Ds = [D[8],D[5],D[2]];
	var As = [A[0],A[3],A[6]];
	var Bs = [B[0],B[3],B[6]];
	var r = ReverseRotationSide( Fs,Ds,As,Bs);
	
	F[6] = r[0][0];
	F[3] = r[0][1];
	F[0] = r[0][2];
	D[8] = r[1][0];
	D[5] = r[1][1];
	D[2] = r[1][2];
	A[0] = r[2][0];
	A[3] = r[2][1];
	A[6] = r[2][2];
	B[0] = r[3][0];
	B[3] = r[3][1];
	B[6] = r[3][2];
	
	viewCube();
	viewOpenCube();
}


//A面から見てキューブを時計回り
function Turn90_A(){
	Rotation_A();
	Rotation_A_F();
	Rotation_F();
	
	viewCube();
	viewOpenCube();
}
//A面から見てキューブを反時計回り
function Turn90_Reverse_A(){
	ReverseRotation_A();
	ReverseRotation_A_F();
	ReverseRotation_F();
	
	viewCube();
	viewOpenCube();
}
//B面から見てキューブを時計回り
function Turn90_B(){
	Rotation_B();
	Rotation_B_D();
	Rotation_D();
	
	viewCube();
	viewOpenCube();
}
//B面から見てキューブを反時計回り
function Turn90_Reverse_B(){
	ReverseRotation_B();
	ReverseRotation_B_D();
	ReverseRotation_D();
	
	viewCube();
	viewOpenCube();
}
//C面から見てキューブを時計回り
function Turn90_C(){
	Rotation_C();
	Rotation_C_E();
	Rotation_E();
	
	viewCube();
	viewOpenCube();
}
//C面から見てキューブを反時計回り
function Turn90_Reverse_C(){
	ReverseRotation_C();
	ReverseRotation_C_E();
	ReverseRotation_E();
	
	viewCube();
	viewOpenCube();
}


//キューブのシャッフル
function Shuffle(){
	var shuffleLine = 0;
	for(var i = 0; i < 50; i++){
		shuffleLine = parseInt((Math.random() * 10));
		switch (shuffleLine){
		case 0:
			Rotation_A();
			break;
		case 1:
			Rotation_A_F();
			break;
		case 2:
			Rotation_F();
			break;
		case 3:
			Rotation_B();
			break;
		case 4:
			Rotation_B_D();
			break;
		case 5:
			Rotation_D();
			break;
		case 6:
			Rotation_C();
			break;
		case 7:
			Rotation_C_E();
			break;
		case 8:
			Rotation_E();
			break;
		case 9:
			Rotation_A();
			Rotation_B_D();
			Rotation_A_F();
			Rotation_C();
			break;
		}
	}
}


//                b0 | b1 | b2
//                -- + -- + --
//                b3 | b4 | b5
//                -- + -- + --
//                b6 | b7 | b8
//                ------------ 
// y0 | y1 | y2 | r0 | r1 | r2 | g0 | g1 | g2 | o0 | o1 | 02
// -- + -- + -- | -- + -- + -- | -- + -- + -- | -- + -- + --
// y3 | y4 | y5 | r3 | r4 | r5 | g3 | g4 | g5 | o3 | o4 | o5
// -- + -- + -- | -- + -- + -- | -- + -- + -- | -- + -- + --
// y6 | y7 | y8 | r6 | r7 | r8 | g6 | g7 | g8 | o6 | o7 | o8
//                ------------
//                w6 | w7 | w8
//                -- + -- + --
//                w3 | w4 | w5
//                -- + -- + --
//                w0 | w1 | w2

//              |              |
//              |              |
//              |      A       |
//              |              |
//              |              |
// ------------   ------------   ------------   ------------
//              |              |              |
//              |              |              |
//      E       |      B       |      C       |       D
//              |              |              |
//              |              |              |
// ------------   ------------   ------------   ------------
//              |              |
//              |              |
//              |      F       |
//              |              |
//              |              |
//


//キューブの状態を表示
function viewCube(){
	document.getElementById("Aview").innerHTML=viewA();
	document.getElementById("Bview").innerHTML=viewB();
	document.getElementById("Cview").innerHTML=viewC();
}
function viewOpenCube(){
	document.getElementById("openAview").innerHTML=viewA();
	document.getElementById("openBview").innerHTML=viewB();
	document.getElementById("openCview").innerHTML=viewC();
	document.getElementById("openDview").innerHTML=viewD();
	document.getElementById("openEview").innerHTML=viewE();
	document.getElementById("openFview").innerHTML=viewF();
}
////キューブの色の配置を生成する処理
function viewA(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
    return (imG);
}
function viewB(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewC(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewD(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+D[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+D[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+D[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+D[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+D[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+D[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+D[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+D[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+D[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
    return (imG);
}
function viewE(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+E[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+E[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+E[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+E[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+E[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+E[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+E[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+E[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+E[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
    return (imG);
}
function viewF(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+F[6]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+F[7]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+F[8]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+F[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+F[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+F[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+F[0]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+F[1]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+F[2]+"' style='position:relative;  top:-2px; left:-452px;'>";
    return (imG);
}



///////////////////////////ボタンにマウスのポインタをのせた時、回転する部分の色を変えて表示させる処理
//////A面の回転
function choose_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_A_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_A_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_A(){
	document.getElementById("Aview").innerHTML=choose_A();
	document.getElementById("Bview").innerHTML=choose_A_B();
	document.getElementById("Cview").innerHTML=choose_A_C();
}
////A面とF面の間の回転
function choose_AF_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_AF_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_AF(){
	document.getElementById("Bview").innerHTML=choose_AF_B();
	document.getElementById("Cview").innerHTML=choose_AF_C();
}
////F面の回転
function choose_F_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_F_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_F(){
	document.getElementById("Bview").innerHTML=choose_F_B();
	document.getElementById("Cview").innerHTML=choose_F_C();
}

/////B面の回転
function choose_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_B_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_B_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_B(){
	document.getElementById("Aview").innerHTML=choose_B_A();
	document.getElementById("Bview").innerHTML=choose_B();
	document.getElementById("Cview").innerHTML=choose_B_C();
}
////B面とD面の間の回転
function choose_BD_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_BD_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_BD(){
	document.getElementById("Aview").innerHTML=choose_BD_A();
	document.getElementById("Cview").innerHTML=choose_BD_C();
}
////D面の回転
function choose_D_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_D_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_D(){
	document.getElementById("Aview").innerHTML=choose_D_A();
	document.getElementById("Cview").innerHTML=choose_D_C();
}

//////C面の回転
function choose_C(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+C[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+C[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+C[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+C[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_C_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_C_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_C(){
	document.getElementById("Aview").innerHTML=choose_C_A();
	document.getElementById("Bview").innerHTML=choose_C_B();
	document.getElementById("Cview").innerHTML=choose_C();
}
////C面とE面の間の回転
function choose_CE_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_CE_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='Choose"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_CE(){
	document.getElementById("Aview").innerHTML=choose_CE_A();
	document.getElementById("Bview").innerHTML=choose_CE_B();
}
////E面の回転
function choose_E_A(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+A[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+A[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+A[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+A[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+A[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+A[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function choose_E_B(){
	var imG = "<img src='waku.gif'>"+
	"<img src='Choose"+B[0]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[1]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='"+B[2]+"' style='position:relative;  top:-102px; left:-152px;'>"+
    "<img src='Choose"+B[3]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[4]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='"+B[5]+"' style='position:relative;  top:-52px; left:-302px;'>"+
    "<img src='Choose"+B[6]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[7]+"' style='position:relative;  top:-2px; left:-452px;'>"+
    "<img src='"+B[8]+"' style='position:relative;  top:-2px; left:-452px;'>";
	return (imG);
}
function viewChoose_E(){
	document.getElementById("Aview").innerHTML=choose_E_A();
	document.getElementById("Bview").innerHTML=choose_E_B();
}

/////ここまで ボタンにマウスのポインタをのせた時、回転する部分の色を変えて表示させる処理

