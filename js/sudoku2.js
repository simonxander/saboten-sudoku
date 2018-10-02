// this code is copyright (c)2007-2014 Influenca Ltd. All rights Reserved. Do not use it other than through the code supplied by our 'on your site' page. You may not copy this code to any other server without permission.
// for timer
var seconds = 0;

screen.updateInterval = 200;
var alerted = 0;
var sroot = 3;
var side = sroot * sroot;
var sodu = new Array();
var sogrid = new Array();
var visi = new Array();
var sudoku = new Array();
var nums = "123456789";
var avail = "123456789"
var cullistx = ""
var cullisty = ""
var carrot = 0
var thisone = " ";
var solvable = 0
var grouppos = "";
var progress = 0;
var hinting = 0;
var yc = 0;
var xc = 0;
var xname = -1; // name of table x position (column)
var yname = -1;
var thickx = -1; // count to thick line at sroot
var thicky = 0;
var hint = "";
var lastx = 0;
var lasty = 0;
var delast = 0;
var givens = 0;
var setnumber = 1;
var setit = 0;

var tStart = new Date();
//var gDate = new Date();
var hints = 0;

var wleft = wtop = 0;

var touchscreen = 0;

if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
	var mobile = 1;
	touchscreen = 1;
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	isize = Math.round((w - 94) / 9);
	document.getElementsByTagName("BODY")[0].classList.add('mobile');

} else {
	var mobile = 0;
	isize = 60;
}
//mobile=1 // for testing only - delete after

if (navigator.userAgent.match(/iPad/i)) {
	mobile = 0;
	isize = 60;
}


function startNew() {
	alerted = 0;
	sodu.length = 0;
	sogrid.length = 0;
	visi.length = 0;
	sudoku.length = 0;
	nums = "123456789";
	avail = "123456789"
	cullistx = ""
	cullisty = ""
	carrot = 0
	thisone = " ";
	solvable = 0
	grouppos = "";
	progress = 0;
	hinting = 0;
	yc = 0;
	xc = 0;
	xname = -1; // name of table x position (column)
	yname = -1;
	thickx = -1; // count to thick line at sroot
	thicky = 0;
	hint = "";
	lastx = 0;
	lasty = 0;
	delast = 0;
	givens = 0;
	setnumber = 1;
	setit = 0;

	tStart = new Date();
	hints = 0;

	wleft = wtop = 0;

	//Clear grid
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			if (touchscreen == 1 || mobile == 1) {
				newout = "<a href='javascript:enterdata(" + x + "," + y + ")'><img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + x + y + " id=i" + x + y + " ></a>";
			} else {
				newout = "<img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + x + y + " id=i" + x + y + " onclick=\"event.stopPropagation(); enterdata(" + x + "," + y + ")\" >";
			}
			var v = document.getElementById('mainTable').rows[y].cells
			v[x].innerHTML = newout
		}
	}

	makesudoku();
	replicatesodu();
	calcvisible();
}

// +++++++++++++++++++ from make sudoku ++++++++++++++++++++++++++
function makesudoku() {
	//document.write("generating grid");
	nums = "123456789";
	avail = "123456789";
	cullisty = "";
	cullistx = "";
	/*// 1 create centre grid
	for (x = 4; x < 7; x++) {
		for (y = 4; y < 7; y++) {
			carrot = Math.round(Math.random() * (nums.length - 1))
			sodu[x + "-" + y] = nums.charAt(carrot)
			nums = nums.replace(nums.charAt(carrot), "")
		}
	}

	foldout(4, 7, 4, 7, 1)
	// 3 fold the top one out both sides
	foldout(1, 4, 4, 7, 0)
	// put available numbers in remaining boxes and then cull, pick at random, etc.
	halffoldout(4, 7, 4, 7)
	halffoldout(7, 10, 4, 7)*/
	my_sodu = {
		'1-1': "9", '1-2': "7", '1-3': "8", '1-4': "4", '1-5': "2", '1-6': "6", '1-7': "5", '1-8': "3", '1-9': "1",
		'2-1': "3", '2-2': "6", '2-3': "4", '2-4': "5", '2-5': "8", '2-6': "1", '2-7': "7", '2-8': "9", '2-9': "2",
		'3-1': "5", '3-2': "2", '3-3': "1", '3-4': "7", '3-5': "3", '3-6': "9", '3-7': "4", '3-8': "8", '3-9': "6",
		'4-1': "6", '4-2': "4", '4-3': "9", '4-4': "8", '4-5': "7", '4-6': "5", '4-7': "1", '4-8': "2", '4-9': "3",
		'5-1': "2", '5-2': "3", '5-3': "7", '5-4': "1", '5-5': "9", '5-6': "4", '5-7': "6", '5-8': "5", '5-9': "8",
		'6-1': "1", '6-2': "8", '6-3': "5", '6-4': "3", '6-5': "6", '6-6': "2", '6-7': "9", '6-8': "4", '6-9': "7",
		'7-1': "7", '7-2': "9", '7-3': "3", '7-4': "6", '7-5': "5", '7-6': "8", '7-7': "2", '7-8': "1", '7-9': "4",
		'8-1': "4", '8-2': "5", '8-3': "6", '8-4': "2", '8-5': "1", '8-6': "3", '8-7': "8", '8-8': "7", '8-9': "9",
		'9-1': "8", '9-2': "1", '9-3': "2", '9-4': "9", '9-5': "4", '9-6': "7", '9-7': "3", '9-8': "6", '9-9': "5"
	}
	for (key in my_sodu) {
		sodu[key] = my_sodu[key];
	}

	removeduplicates(0)
	removeloners()
	sortcullist()
	removeduplicates(0)
	removeloners()
	sortcullist()
	randomassign()
}

// 2 fold it out to create correct numbers all the way down the centre
function intersect(mainarray, otherone) {
	//return intersection of the two strings
	var inter = "";
	for (i = 0; i <= otherone.length; i++) {
		if (mainarray.indexOf(otherone.charAt(i)) >= 0) {
			inter = inter + otherone.charAt(i)
		}
	}
	return inter;
}

function indie(mainarray, otherone) {
	// get mainarray without anything from otherone
	var inter = mainarray;
	for (i = 0; i <= otherone.length; i++) {
		if (mainarray.indexOf(otherone.charAt(i)) >= 0) {
			inter = inter.replace(otherone.charAt(i), "")
		}
	}
	return inter;
}

function foldout(rxmin, rxmax, ymin, ymax, horizontal) {
	var rnums = " ";
	var lnums = " ";
	var lastone = "";
	for (rx = rxmin; rx < rxmax; rx++) { // column we are expanding
		avail = "123456789";
		for (y = ymin; y < ymax; y++) { // row
			if (horizontal == 1) {
				avail = avail.replace(sodu[rx + "-" + y], "")
			} else {
				avail = avail.replace(sodu[y + "-" + rx], "")
			}
		}
		//get anything from rnums first, because numbers from rnums need to be in lnums eventually
		lavailb = indie(avail, lnums) // without the ones we used
		lavail = intersect(lavailb, rnums) // the ones we have no used on this side, but have on the other
		// LEFT / UPPER half
		for (y = 1; y <= 3; y++) { // y can be x coordinate if horizontal=0
			if (lavail.length > 0) {
				carrot = Math.round(Math.random() * (lavail.length - 1))
				thisone = lavail.charAt(carrot)
			} else {
				carrot = Math.round(Math.random() * (lavailb.length - 1))
				thisone = lavailb.charAt(carrot)
			}
			if (horizontal == 1) {
				sodu[rx + "-" + y] = thisone
			} else {
				sodu[y + "-" + rx] = thisone
			}
			lavail = lavail.replace(thisone, "")
			lavailb = lavailb.replace(thisone, "")
			avail = avail.replace(thisone, "")
			lnums = lnums + thisone
		}

		// RIGHT / LOWERr half
		//intersect / inter - not necessary - there are only three numbers left!
		for (y = 7; y <= 9; y++) {
			carrot = Math.round(Math.random() * (avail.length - 1))
			thisone = avail.charAt(carrot)
			if (horizontal == 1) {
				sodu[rx + "-" + y] = thisone
			} else {
				sodu[y + "-" + rx] = thisone
			}
			avail = avail.replace(thisone, "")
			rnums = rnums + thisone
		}
	}
}

function halffoldout(rxmin, rxmax, ymin, ymax) {
	// shows all options
	for (rx = rxmin; rx < rxmax; rx++) { // column we are expanding
		avail = "123456789";
		for (y = ymin; y < ymax; y++) { // row

			avail = avail.replace(sodu[y + "-" + rx], "")

		}
		for (y = 1; y <= 3; y++) {
			sodu[y + "-" + rx] = avail
		}
		for (y = 7; y <= 9; y++) {
			sodu[y + "-" + rx] = avail
		}
	}
}



function cull(xpos, ypos) {
	var victim = sodu[xpos + "-" + ypos]
	var lowestx = 0
	var lowesty = 0
	var highesty = 0
	var highestx = 0
	var charc = "";
	var group = 0
	for (cy = 1; cy <= side; cy++) {
		if (cy != ypos & sodu[xpos + "-" + cy].length > 1) {
			sodu[xpos + "-" + cy] = sodu[xpos + "-" + cy].replace(victim, "")
			if (sodu[xpos + "-" + cy].length == 1) {
				cullistx = cullistx + xpos
				cullisty = cullisty + cy
				if (visi[xpos + "-" + cy] != 1) {
					visi[xpos + "-" + cy] = 2
				}
				if (hinting == 1) {
					//alert ("From first part of cull - "+ xpos+"-"+cy);
					if (hint == "") {
						hint = xpos + "-" + cy;
					}
				}
			}
		}
	}
	for (cx = 1; cx <= side; cx++) {
		if (cx != xpos & sodu[cx + "-" + ypos].length > 1) {
			sodu[cx + "-" + ypos] = sodu[cx + "-" + ypos].replace(victim, "")
			if (sodu[cx + "-" + ypos].length == 1) {
				cullistx = cullistx + cx
				cullisty = cullisty + ypos
				if (visi[cx + "-" + ypos] != 1) {
					visi[cx + "-" + ypos] = 2
				}
				if (hinting == 1) {
					//alert ("From second part of cull");
					if (hint == "") {
						hint = cx + "-" + ypos;
					}
				}
			}
		}
	}

	group = Math.round(((xpos - 1) / sroot) - 0.5)
	lowestx = sroot * group + 1;
	highestx = lowestx + 2;
	group = Math.round(((ypos - 1) / sroot) - 0.5)
	lowesty = sroot * group + 1;
	highesty = lowesty + 2;
	for (cy = lowesty; cy <= highesty; cy++) {
		for (cx = lowestx; cx <= highestx; cx++) {
			charc = "+" + sodu[cx + "-" + cy];
			if (cx == xpos & cy == ypos) {
				//document.write("on small square")
			} else if (charc.length > 2) {
				sodu[cx + "-" + cy] = charc.replace(victim, "")
				sodu[cx + "-" + cy] = sodu[cx + "-" + cy].replace("+", "")
				if (sodu[cx + "-" + cy].length == 1) {
					if (visi[cx + "-" + cy] != 1) {
						visi[cx + "-" + cy] = 2
					}
					if (hinting == 1) {
						if (hint == "") {
							//alert ("From third part of cull");
							hint = cx + "-" + cy;
						}
					}

					progress = 1; // changed 
					cullistx = cullistx + cx
					cullisty = cullisty + cy
				}
			} else if (charc.length == 2 & charc.indexOf(victim) >= 0) {
				if (setit == 0) {
					//if (alerted==0){
					//alerted=1				
					//alert("Your computer may warn you that the script is taking too long. Let it finish. All will be well.")
					//}
					makesudoku()
				}
			}
		}
	}
}

function removeduplicates(visibility) {
	// from a position of some unique numbers, and some strings of numbers, remove all the duplicates where single numbers repeated in groups of possibilities
	for (yd = 1; yd <= side; yd++) {
		for (xd = 1; xd <= side; xd++) {
			if (sodu[xd + "-" + yd].length == 1) {
				cull(xd, yd)
			}
		}
	}
}

function removeloners() {
	//if we have, on a line, something like 1239 456 78 1234 5678 2781634 1238 182376 134, then the 9 must be in the first group because its the only one
	var xcount = 0
	var ycount = 0
	var gcount = new Array();
	var lastoneg = new Array();
	var lasto = ""
	var dex = 0
	var arcel = ""
	var xco = 0
	var yco = 0
	for (n = 1; n <= side; n++) {
		for (ym = 1; ym <= side; ym++) {
			xcount = 0;
			ycount = 0;
			for (xm = 1; xm <= side; xm++) {
				arcel = "@" + sodu[xm + "-" + ym];
				dex = arcel.indexOf(n);
				if (dex >= 0) {
					xcount++;
					lastonex = xm + "-" + ym;


				}
				arcel = "@" + sodu[ym + "-" + xm];
				dex = arcel.indexOf(n)
				if (dex >= 0) {
					ycount++;
					lastoney = ym + "-" + xm;


				}
			}
			if (xcount == 1) {
				if (sodu[lastonex].length > 1) {
					sodu[lastonex] = n
					cull(lastonex.charAt(0), lastonex.charAt(2))
					grouppos = lastonex.charAt(0) + "-" + lastonex.charAt(2)
					visi[lastonex.charAt(0) + "-" + lastonex.charAt(2)] = 2
					if (hint == "") {
						//alert ("from 310");
						hint = lastonex.charAt(0) + "-" + lastonex.charAt(2)
					}
					progress = 2; // changed 
				}
			}
			if (ycount == 1) {

				if (sodu[lastoney].length > 1) {
					sodu[lastoney] = n
					cull(lastoney.charAt(0), lastoney.charAt(2))
					grouppos = lastoney.charAt(0) + "-" + lastoney.charAt(2)
					visi[lastoney.charAt(0) + "-" + lastoney.charAt(2)] = 2
					progress = 3; // changed 
					if (hint == "") {
						//alert ("from 326");
						hint = lastoney.charAt(0) + "-" + lastoney.charAt(2);
					}
				}
			}
		}


		// ++++++++++ now look in GROUPs ++++++++++++++++
		for (gcy = 0; gcy < sroot; gcy++) {
			for (gcx = 0; gcx < sroot; gcx++) {
				gname = gcx + "-" + gcy
				gcount[gname] = 0
				for (xm = 1; xm <= sroot; xm++) {
					for (ym = 1; ym <= sroot; ym++) {
						xco = 3 * gcx + xm
						yco = 3 * gcy + ym
						arcel = "@" + sodu[xco + "-" + yco];
						dex = arcel.indexOf(n);
						if (dex >= 0) {
							gcount[gname]++;
							lastoneg[gname] = xco + "-" + yco;
						}
					}
				}
			}
		}

		for (gcy = 0; gcy <= sroot; gcy++) {
			for (gcx = 0; gcx <= sroot; gcx++) {
				lasto = lastoneg[gcx + "-" + gcy]
				if (gcount[gcx + "-" + gcy] == 1) {

					if (sodu[lasto].length > 1) {
						sodu[lasto] = n
						grouppos = lasto.charAt(0) + "-" + lasto.charAt(2)
						visi[lasto.charAt(0) + "-" + lasto.charAt(2)] = 2
						cull(lasto.charAt(0), lasto.charAt(2))
						if (hint == "") {
							//alert ("from 365");
							hint = lasto.charAt(0) + "-" + lasto.charAt(2);
						}

						progress = 4; // changed 
					}
				}
			}
		}

		// +++++++++++++++ group done ++++++++++++++++
	}
}


function randomassign() {
	// from a position of some unique numbers, and some strings of numbers, remove all the duplicates where single numbers repeated in groups of possibilities
	for (y = 1; y <= side; y++) {
		for (x = 1; x <= side; x++) {
			if (sodu[x + "-" + y].length > 1) {

				sodu[x + "-" + y] = sodu[x + "-" + y].charAt(1) // +++++++ make it RANDOM later ++++++++++++++
				cull(x, y)
				sortcullist()
				removeloners()
			}
		}
		//showit()
	}
}



function sortcullist() {
	while (cullistx.length > 0) {
		progress = 5; // changed 
		cull(cullistx.charAt(0), cullisty.charAt(0))
		cullistx = cullistx.substr(1)
		cullisty = cullisty.substr(1)
		visi[cullistx + "-" + cullisty] = 2
	}
}

function addnewknown() {
	var xa = 20
	var xb = 20
	xa = Math.round(Math.random() * 10)
	xb = Math.round(Math.random() * 10)
	if (visi[xa + "-" + xb] == 0 & visi[(10 - xa) + "-" + (10 - xb)] == 0) {
		visi[xa + "-" + xb] = 1
		visi[(10 - xa) + "-" + (10 - xb)] = 1
	}
}

function addlongest() {
	var longest = 0
	var knowns = 0
	var givens = 0;
	var longestsqx = " "
	var longestsqy = " "
	solvable = 1
	// tell us what the longest is=> most uncetainty and set it
	for (jx = 1; jx <= side; jx++) {
		for (jy = 1; jy <= side; jy++) {
			if (visi[jx + "-" + jy] == 1 || visi[jx + "-" + jy] == 2) {
				sodu[jx + "-" + jy] = sudoku[jx + "-" + jy]
				knowns++;
				if (visi[jx + "-" + jy] == 1) {
					givens++;
				}
			} else {
				solvable = 0
				if (sodu[jx + "-" + jy].length > longest) {
					if (visi[jy + "-" + jx] == 2) { // check counter part is not calculable
						reserve = jx + "-" + jy
					} else {
						longest = sodu[jx + "-" + jy].length
						longestsqx = " " + jx
						longestsqy = " " + jy
					}
				} else if (sodu[jx + "-" + jy].length == longest) {
					if (visi[jy + "-" + jx] == 0) {
						longestsqx = longestsqx + jx
						longestsqy = longestsqy + jy
					}
				}
			}
		}
	}
	if (solvable == 0) {
		longestsqx = longestsqx.replace(" ", "")
		longestsqy = longestsqy.replace(" ", "")
		//document.write("<br>Choosing from  "+longestsqx+","+longestsqy)
		if (longestsqx.length >= 1) {
			var randomsquare = Math.round(Math.random() * (longestsqx.length - 1))
			var xa = longestsqx.charAt(randomsquare)
			var xb = longestsqy.charAt(randomsquare)

		} else {
			//document.write ("using reserve")
			var xa = reserve.charAt(0)
			var xb = reserve.charAt(2)

		}
		//document.write("<br>"+knowns+" known squares, of which "+givens+" givens. adding in at "+randomsquare+" "+xa+","+xb)
		visi[xa + "-" + xb] = 1
		//visi[(10-xa)+"-"+(10-xb)]=1
		sodu[xa + "-" + xb] = sudoku[xa + "-" + xb]
		showstartno(sudoku[xa + "-" + xb], cellcorrect(xa), cellcorrect(xb))
		cull(xa, xb)
		//sodu[(10-xa)+"-"+(10-xb)]=sudoku[(10-xa)+"-"+(10-xb)]
	}
}


function alignsodu() {
	//make working grid (sodu) same as sudoku where visi==1
	solvable = 1
	var failcount = 0;
	var lastfailurex = ""
	var lastfailurey = ""

	var bestholecount = 0;
	for (jx = 1; jx <= side; jx++) {
		for (jy = 1; jy <= side; jy++) {
			if (visi[jx + "-" + jy] == 1 || visi[jx + "-" + jy] == 2) {
				sodu[jx + "-" + jy] = sudoku[jx + "-" + jy]
				showstartno(sudoku[jx + "-" + jy], cellcorrect(jx), cellcorrect(jy))
			} else {
				solvable = 0
				sodu[jx + "-" + jy] = "123456789"
			}
		}
	}
}

function calcvisible() {
	var jx = 0
	var jy = 0
	for (jx = 1; jx <= side; jx++) {
		for (jy = 1; jy <= side; jy++) {
			visi[jx + "-" + jy] = 0
		}
	}
	for (n = 1; n < 5; n++) {
		addnewknown()
	}
	alignsodu();
	while (solvable == 0) {
		//document.write ("adding in more numbers")
		addlongest()

		progress = 1 // changed
		while (progress > 0) {
			///document.write ("solving:")
			progress = 0;
			removeduplicates(0);
			sortcullist();
			removeloners();
			//showpuzzle()
			//solveig(3)
			//showpuzzle()
			//document.write("<br>Progress-"+progress+"-")
		}

	}
	//	document.write("<br>done with loop - should be finished")
}


function replicatesodu() {
	for (jx = 1; jx <= side; jx++) {
		for (jy = 1; jy <= side; jy++) {
			sudoku[jx + "-" + jy] = sodu[jx + "-" + jy]
		}
	}
}

function showpuzzle() {
	var jx = 0
	var jy = 0
	var givencount = 0;
	document.write("<table border=0>")
	for (jy = 1; jy <= side; jy++) {
		document.write("<tr>")
		for (jx = 1; jx <= side; jx++) {
			document.write("<td>")
			if (visi[jx + "-" + jy] < 1) {
				document.write("<font size=1>" + sodu[jx + "-" + jy] + "</font>")
			} else if (visi[jx + "-" + jy] == 1) {
				document.write("<b>" + sodu[jx + "-" + jy] + "</b>")
				givencount++;
			} else if (visi[jx + "-" + jy] == 2) {
				document.write(sodu[jx + "-" + jy])
			}
			document.write("</td>")
		}
		document.write("</tr>")
	}
	document.write("</table>")
	document.write(givencount + " given")

}

function showvisi() {
	var jx = 0
	var jy = 0
	document.write("<table>")
	for (jy = 1; jy <= side; jy++) {
		document.write("<tr>")
		for (jx = 1; jx <= side; jx++) {
			document.write("<td>")

			document.write(visi[jx + "-" + jy])

			document.write("</td>")
		}
		document.write("</tr>")
	}
	document.write("</table>")
}

function cellcorrect(number) {
	// make allowance for table references starting at zero and having extra cells
	if (number < 4) {
		number = number - 1;
	} else if (number > 6) {
		number++;
	}
	return number;
}

function gridToName(gridRef) {
	var thegrid = gridRef.split("-")
	newx = thegrid[0];
	newy = thegrid[1];
	var theId = cellcorrect(newx) + "-" + cellcorrect(newy);
	return theId;
}


function givemeahint() {
	hint = "";
	var hintname = "";
	hints++;
	hinting = 1;
	var gy = 0;
	var gx = 0;
	var hinted = 0;


	// Check for errors
	for (sy = 1; sy <= side; sy++) {
		if (sy == 4 || sy == 7) {
			gy++;
		}
		gx = 0;
		for (sx = 1; sx <= side; sx++) {
			if (sx == 4 || sx == 7) {
				gx++;
			}

			if (sogrid[gx + "-" + gy] > 0) {
				sodu[sx + "-" + sy] = sogrid[gx + "-" + gy]

				if (sodu[sx + "-" + sy] != sudoku[sx + "-" + sy]) {
					document.getElementById("c" + gx + "-" + gy).classList.add('failed');

					alert("紅色框框錯囉.");
					hinted = 1;

				}
			} else {
				sodu[sx + "-" + sy] = "123456789"

			}
			gx++;
		}

		gy++;
	}
	// make sodu representative of the grid as displayed (from sogrid - minus gaps for dark lines)


	// trying something new

	while (hint == "") {
		removeduplicates('1');
		if (hint != "") {
			hintname = gridToName(hint);
			//alert ("hint: "+hint + "elementById=c"+hintname);
			document.getElementById("c" + hintname).classList.add('hint');

			alert("想想看綠色格子只能放什麼呢？");

		} else {
			removeloners();
			if (hint != "") {
				hintname = gridToName(hint);
				//alert ("hint: "+hint + "elementById=c"+hintname);
				document.getElementById("c" + hintname).classList.add('hint');

				alert("用排除法想想看綠色格子只能放什麼呢？");
			}
		}
	}


	// end of something new






}



printgrid();
makesudoku();
replicatesodu();
calcvisible();
var plugs = navigator.platform;
var gDate = new Date();
var gDiff = gDate.getTime() - tStart.getTime();
var swidth = screen.width;
var sheight = screen.height;
// document.wait.src = 'http://www.picturesudoku.com/gentime.php?time=' + gDiff + '&width=' + swidth + '&height=' + sheight + '&plugs=' + plugs;

setit = 1

// +++++++++++++++++++++++ end of make sudoku +++++++++++++++++++++++++



function checkothers(celno, rowno, addClassName, removeClassName) {
	//highlight in colour, any duplicate numbers
	for (y = 0; y <= yname; y++) {
		if (sogrid[celno + "-" + y] == sogrid[celno + "-" + rowno] && y != rowno) {
			if (addClassName !== null) {
				document.getElementById("c" + celno + "-" + rowno).classList.add(addClassName);
				document.getElementById("c" + celno + "-" + y).classList.add(addClassName);
			} else if (removeClassName !== null) {
				document.getElementById("c" + celno + "-" + rowno).classList.remove(removeClassName);
				document.getElementById("c" + celno + "-" + y).classList.remove(removeClassName);
			}
		}

	}
	for (x = 0; x <= xname; x++) {
		if ((sogrid[x + "-" + rowno] == sogrid[celno + "-" + rowno]) && x != celno) {
			if (addClassName !== null) {
				document.getElementById("c" + celno + "-" + rowno).classList.add(addClassName);
				document.getElementById("c" + x + "-" + rowno).classList.add(addClassName);
			} else if (removeClassName !== null) {
				document.getElementById("c" + celno + "-" + rowno).classList.remove(removeClassName);
				document.getElementById("c" + x + "-" + rowno).classList.remove(removeClassName);
			}
		}
	}
	//work out y in pos, y out pos, x in pos, x out pos for the block this one fits in
	var group = (Math.round((celno / (sroot + 1)) - 0.5))
	lowestx = sroot * group + Math.round(group / sroot);
	highestx = lowestx + sroot;
	group = Math.round(((rowno) / (sroot + 1)) - 0.5)
	lowesty = sroot * group + Math.round(group / sroot);
	highesty = lowesty + sroot;
	for (y = lowesty; y <= highesty; y++) {
		for (x = lowestx; x <= highestx; x++) {
			if ((sogrid[x + "-" + y] == sogrid[celno + "-" + rowno]) && (x != celno) && (y != rowno)) {
				if (addClassName !== null) {
					document.getElementById("c" + celno + "-" + rowno).classList.add(addClassName);
					document.getElementById("c" + x + "-" + y).classList.add(addClassName);
				} else if (removeClassName !== null) {
					document.getElementById("c" + celno + "-" + rowno).classList.remove(removeClassName);
					document.getElementById("c" + x + "-" + y).classList.remove(removeClassName);
				}
			}
		}
	}

}

function showstartno(toshow, celno, rowno) {
	if (touchscreen == 1) {
		newout = "<img src=" + pics[toshow] + " name=i" + celno + "-" + rowno + " id=i" + celno + "-" + rowno + " border=0  width=" + isize + " height=" + isize + " ontouchend='document.getElementById(\"chooseapic\").style.visibility = \"hidden\"' alt=" + toshow + ">";
	} else {
		newout = "<img src=" + pics[toshow] + " name=i" + celno + "-" + rowno + " id=i" + celno + "-" + rowno + " border=0  width=" + isize + " height=" + isize + " style='border:none' onclick='document.getElementById(\"chooseapic\").style.visibility = \"hidden\"'>";
	}
	var v = document.getElementById('mainTable').rows[rowno].cells
	v[celno].classList.add("question-cell");
	v[celno].classList.remove("hvr-underline-from-center");
	v[celno].classList.remove("ansId");
	v[celno].innerHTML = newout
	sogrid[celno + "-" + rowno] = toshow;

}

function findxPos(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		//curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			//curtop += obj.offsetTop
		}
	}
	return curleft
}

function findyPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		//curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			//curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return curtop;
}

function shownumber(toshow, celno, rowno) {
	//if (mobile!=1){
	var v = document.getElementById('chooseapic');
	v.style.visibility = "hidden"
	//	}
	rsize = isize // *2 to keep it even, and so symmetrical
	if (touchscreen == 1 || mobile == 1) {
		newout = "<a href='javascript:revert(" + celno + "," + rowno + ")'><img src=" + pics[toshow] + " name=i" + celno + rowno + " id=i" + celno + rowno + " border=0  width=" + rsize + " height=" + rsize + " alt=" + toshow + "'></a>";
	} else {
		newout = "<a href='javascript:revert(" + celno + "," + rowno + ")'><img src=" + pics[toshow] + " name=i" + celno + rowno + " id=i" + celno + rowno + " border=0  width=" + rsize + " height=" + rsize + " onclick='event.stopPropagation(); document.getElementById(\"chooseapic\").style.visibility = \"hidden\"'></a>";
	}
	var v = document.getElementById('mainTable').rows[rowno].cells

	v[celno].innerHTML = newout
	sogrid[celno + "-" + rowno] = toshow;
	checkothers(celno, rowno, 'failed', null);
	checkdone();
	lastx = 0;
	lasty = 0;
	delast = 0;
}

function enterdata(celno, rowno) {
	var list = document.getElementById("c" + celno + "-" + rowno).classList;
	list.remove('hint');
	if (list.contains('failed')) {
		document.getElementById("c" + celno + "-" + rowno).classList.remove('failed');
		checkothers(celno, rowno, null, 'failed');
	} else {
		//alert (bg);
		document.getElementById("c" + celno + "-" + rowno).classList.remove('failed');
	}

	if (mobile == 1) {
		if (sogrid[celno + "-" + rowno] != setnumber) {
			shownumber(setnumber, celno, rowno);
		} else {
			revert(celno, rowno)
		}
	} else {
		var obj = document.getElementById("i" + celno + rowno);

		//alert (celno+"-"+rowno + ":" +  findxPos(obj) + "?");
		var xlayer = findxPos(obj) - 30;
		var ylayer = findyPos(obj) - 30;
		var agent = navigator.userAgent.toLowerCase();
		//if (agent.indexOf("msie") != -1){
		ylayer = ylayer + yoffset;
		xlayer = xlayer + xoffset;
		//}
		xlayer = xlayer + "px";
		ylayer = ylayer + "px";
		//findPos(bobobo);

		sogrid[celno + "-" + rowno] = '';
		newout = '<table cellpadding=2 cellspacing=0 border=0 bgcolor=#000000><tr><td><table cellpadding=0 cellspacing=0 border=0>';
		n = 1;
		for (y = 1; y <= sroot; y++) {
			newout = newout + '<tr>';
			for (x = 1; x <= sroot; x++) {
				newout = newout + "<td><a href='javascript:shownumber(" + n + "," + celno + "," + rowno + ")'><img src='" + pics[n] + "' width=40 height=40 border=0 alt=" + n + "></a></td>";
				n++;
			}
			newout = newout + '</tr>';
		}
		newout = newout + '</table></td></tr></table>';
		var v = document.getElementById('chooseapic');
		v.innerHTML = newout;
		v.style.visibility = "visible";

		v.style.left = xlayer;
		v.style.top = ylayer;

		revert(celno, rowno)
		delast = 1
		lastx = celno
		lasty = rowno
	}
}

function revert(celno, rowno) {
	if (touchscreen == 1 || mobile == 1) {
		newout = "<a href='javascript:enterdata(" + celno + "," + rowno + ")'><img src='images/shim.gif' width=" + isize + " height=" + isize + "name=i" + celno + rowno + " id=i" + celno + rowno + " ></a>";
	} else {
		newout = "<img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + celno + rowno + " id=i" + celno + rowno + " onclick=\"event.stopPropagation(); enterdata(" + celno + "," + rowno + ")\" >";
	}

	var v = document.getElementById('mainTable').rows[rowno].cells
	v[celno].innerHTML = newout
	v[celno].classList.remove('failed');
	checkothers(celno, rowno, null, 'failed');
	sogrid[celno + "-" + rowno] = '';

}

function solveig(difficulty) {
	// for the situation where there are n groups of n numbers i.e 123 123 123 1234 5 6 7 8 9  would remove 123 as possibility from 1234 (=4)
	//difficulty=n - the higher the harder
	var rowcount = 0
	var colcount = 0
	var tempstr = " "
	var donelist = "::";
	var colsuccess = 0
	var rowsuccess = 0
	for (jy = 1; jy <= 9; jy++) {
		for (jx = 1; jx <= 9; jx++) {
			//sodu[jx+"-"+jy]
			if (sodu[jx + "-" + jy] <= 10 ^ difficulty & sodu[jx + "-" + jy] >= 10) {
				//look for others where it is the same
				rowcount = 0; // start at zero, but no special case for current, so should be fine
				colcount = 0;
				for (line = 1; line <= 9; line++) {
					if (sodu[jx + "-" + line] == sodu[jx + "-" + jy]) {
						rowcount++;
					}
					if (sodu[line + "-" + jy] == sodu[jx + "-" + jy]) {
						colcount++;
					}
				}
				if (colcount == sodu[jx + "-" + jy].length) {
					for (pl = 0; pl <= sodu[jx + "-" + jy].length - 1; pl++) {

						for (line = 1; line <= 9; line++) {
							if (sodu[line + "-" + jy] > 10 & sodu[line + "-" + jy] != sodu[jx + "-" + jy]) {

								if (sodu[line + "-" + jy].indexOf(sodu[jx + "-" + jy].charAt(pl)) >= 0) {
									document.write("<p> (col) removing one" + sodu[jx + "-" + jy].charAt(pl) + " from " + sodu[line + "-" + jy])
									sodu[line + "-" + jy] = sodu[line + "-" + jy].replace(sodu[jx + "-" + jy].charAt(pl), "");
									document.write("=>" + sodu[line + "-" + jy] + " ")
									progress = 1
									if (sodu[line + "-" + jy] < 10) {
										document.write("<p> so this one is " + sodu[line + "-" + jy] + " & culling");
										cull(line, jy);
										visi[line + "-" + jy] = 2
									}
								}
							}
						}
					}
					colsuccess = 1; // and quit - might be another combo, but processor time
				}
				if (rowcount == sodu[jx + "-" + jy].length) {

					donelist = donelist + sodu[jx + "-" + jy] + ";"
					for (pl = 0; pl <= sodu[jx + "-" + jy].length - 1; pl++) {

						for (line = 1; line <= 9; line++) {
							if (sodu[jx + "-" + line] > 10 & sodu[jx + "-" + line] != sodu[jx + "-" + jy]) {
								if (sodu[jx + "-" + line].indexOf(sodu[jx + "-" + jy].charAt(pl)) >= 0) {
									document.write("<p> (row) removing " + sodu[jx + "-" + jy].charAt(pl) + " from " + sodu[jx + "-" + line])
									sodu[jx + "-" + line] = sodu[jx + "-" + line].replace(sodu[jx + "-" + jy].charAt(pl), "");
									document.write("=>" + sodu[jx + "-" + line] + " ")
									if (sodu[jx + "-" + line] < 10) {
										document.write("<p> so this one is " + sodu[jx + "-" + line] + " & culling");
										cull(jx, line);
										visi[jx + "-" + line] = 2
									}
									progress = 1

								}
							}
						}
					}
					rowsuccess = 1; // and quit - might be another combo, but processor time
				}
				if (colsuccess == 1) {
					jx = 10;
				}
				if (rowsuccess == 1) {
					jy = 10;
				}
				// and minigrids!
			}
		}
	}
}


function printgrid() {
	// now output the grid, with pictures
	if (touchscreen == 1 || mobile == 1) {
		document.getElementsByTagName("BODY")[0].setAttribute('ontouchend', 'document.getElementById(\"chooseapic\").style.visibility = \"hidden\"');
	} else {
		document.getElementsByTagName("BODY")[0].setAttribute('onclick', 'document.getElementById(\"chooseapic\").style.visibility = \"hidden\"');
	}
	var waitimg = 'wait'
	document.write('<div class="chooseapic" name="chooseapic" id="chooseapic" style="position:absolute; top:-30px; left:-30px; z-index:3;">&nbsp;</div>')
	document.write("<div class='sudokuBox' style='position:relative; z-index:1;'><table name='mainTable' id='mainTable' cellspacing=1 cellpadding=1>");
	colspan = side + sroot - 1;
	for (y = 1; y <= side; y++) {
		thickx = -1;
		xname = -1;
		if (thicky >= sroot) {
			document.write("<tr class='line'><td colspan=" + colspan + "></td></tr>");
			yname++;
			thicky = 0;
		}
		yname++;
		thicky++;
		document.write("<tr>");
		for (x = 1; x <= side; x++) {
			xname++;
			thickx++;
			if (thickx >= sroot) {
				document.write("<td class='line'><img src=images/shim.gif width=1 height=1></td>");
				xname++;
				thickx = 0;
			}
			spoint = x + "-" + y;

			document.write("<td class='ansTd hvr-underline-from-center' name=c" + xname + "-" + yname + " id=c" + xname + "-" + yname + "  valign=\"middle\" align=\"center\">");



			if (touchscreen == 1 || mobile == 1) {
				document.write("<a href='javascript:enterdata(" + xname + "," + yname + ")'><img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + xname + yname + " id=i" + xname + yname + "></a>");
			} else {
				document.write("<img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + xname + yname + " id=i" + xname + yname + " onclick=\"event.stopPropagation(); enterdata(" + xname + "," + yname + ")\" >");
			}

			//}
			document.write("</td>");

		}
		document.write("</tr>");
	}
	if (mobile == 1) { // print a menu of numbers
		var mobimenu = '<tr><td colspan=11><img src="images/shim.gif" width=1 height=1></td></tr><tr bgcolor="#dfdfdf"><td colspan=11>選擇項目後在上方點選想要放置的位置</td></tr><tr bgcolor="#dfdfdf">';
		var n = 1
		for (x = 1; x <= 9; x++) {
			mobimenu = mobimenu + "<td id='u" + n + "' name='u" + n + "'  align='center' valign='middle'><a href='javascript:usenumber(" + n + ")'><img style=\"vertical-align: bottom;\" src='" + pics[n] + "' width=30 height=30 border=0 alt=" + n + "></a></td>";
			if (x == 3 || x == 6)
				mobimenu = mobimenu + "<td><img src='images/shim.gif' width=1 height=" + isize + "></td>";
			n++;
		}
		mobimenu = mobimenu + '</tr>';
		document.write(mobimenu);
	}


	// document.write("<tr><td colspan=11><input class='submit' type='button' name='c' value='給我點提示吧' onclick='javascript:givemeahint()'></td></tr></table>");
}

function usenumber(chosenOne) {
	document.getElementById("u" + setnumber).style.background = "#dfdfdf";
	setnumber = chosenOne;
	document.getElementById("u" + chosenOne).style.background = "#339933";

}



function checkdone() {
	// are we there yet?
	var failed = 0;
	var gx = 0;
	var gy = 0
	for (sy = 1; sy <= side; sy++) {
		if (sy == 4 || sy == 7) {
			gy++;
		}
		gx = 0;
		for (sx = 1; sx <= side; sx++) {
			if (sx == 4 || sx == 7) {
				gx++;
			}
			if (sogrid[gx + "-" + gy] != sudoku[sx + "-" + sy]) {
				failed = 1;
			}
			gx++;
		}
		gy++;
	}
	gx = 0;
	gy = 0;
	if (failed == 0) {

		for (sy = 1; sy <= side; sy++) {
			if (sy == 4 || sy == 7) {
				gy++;
			}
			gx = 0;
			for (sx = 1; sx <= side; sx++) {
				if (sx == 4 || sx == 7) {
					gx++;
				}
				// make each cell green
				document.getElementById("c" + gx + "-" + gy).style.background = "#339933";
				gx++;
			}
			gy++;
		}
		var dDate = new Date();
		var dDiff = dDate.getTime() - gDate.getTime();
		stopSeconds();
        document.getElementById('complete-box').innerHTML = "恭喜你完成挑戰，共花了 " + seconds + " 秒";
        document.getElementById('complete-box').style.display = "inline-block";
        document.getElementById('complete-box-wrapper').style.display = "flex";
		// document.wait.src = 'http://www.picturesudoku.com/duntime.php?time=' + dDiff + '&hints=' + hints;
		// if (window.confirm('Congratulations! You have completed this sudoku! Would you like to see your time, and how it compares with other people?')) {
			// window.location.href = 'http://picturesudoku.com/myresults.htm?' + dDiff + '?' + hints;
		// }
	}

}

function startNew() {
	//Clear grid
	for (var cx = 0; cx < 11; cx++) {
		if (cx == 3 || cx == 7) {
			cx++;
		}
		for (var cy = 0; cy < 11; cy++) {
			if (cy == 3 || cy == 7) {
				cy++;
			}
			// document.getElementById("c" + cx + "-" + cy).style.background = "#CCCCCC";
			newout = "";
			//alert (cx+", "+cy+": ");
			if (touchscreen == 1 || mobile == 1) {
				newout = "<a href='javascript:enterdata(" + cx + "," + cy + ")'><img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + cx + cy + " id=i" + cx + cy + "></a>";
			} else {
				newout = "<img src='images/shim.gif' width=" + isize + " height=" + isize + " name=i" + cx + cy + " id=i" + cx + cy + " onclick=\"event.stopPropagation(); enterdata(" + cx + "," + cy + ")\" >";
			}

			var v = document.getElementById('mainTable').rows[cy].cells
			v[cx].innerHTML = newout;

		}

	}
	alerted = 0;
	sodu = [];
	sogrid = [];
	visi = [];
	sudoku = [];
	nums = "123456789";
	avail = "123456789"
	cullistx = ""
	cullisty = ""
	carrot = 0
	thisone = " ";
	solvable = 0
	grouppos = "";
	progress = 0;
	hinting = 0;
	yc = 0;
	xc = 0;
	xname = -1; // name of table x position (column)
	yname = -1;
	thickx = -1; // count to thick line at sroot
	thicky = 0;
	hint = "";
	lastx = 0;
	lasty = 0;
	delast = 0;
	givens = 0;
	setnumber = 1;
	setit = 0;

	tStart = new Date();
	hints = 0;

	wleft = wtop = 0;

	makesudoku();
	replicatesodu();
	calcvisible();
}
document.write("</div>");

var el = document.getElementById('seconds-counter');

function incrementSeconds() {
    seconds += 1;
    el.innerText = "⏰ 遊戲進行時間 " + seconds + " 秒.";
}

function stopSeconds() {
    el.innerText = "⏰ 遊戲完成時間 " + seconds + " 秒.";
    clearInterval(cancel);
}

var cancel = setInterval(incrementSeconds, 1000);
