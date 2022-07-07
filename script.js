function Random(n) {
  const rand = parseInt(Math.random() * n);
  return rand;
}
const print = console.log;
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];
class waveFunctionCollapse {
  constructor(height, width) {
    this.Queue = [];
    this.height = height;
    this.width = width;
    this.start = null;
    this.grid = [];
    this.nodes = {};
    this.Classes = ["BLANK", "UP", "RIGHT", "DOWN", "LEFT"];
    this.BLANK = 0;
    this.UP = 1;
    this.RIGHT = 2;
    this.DOWN = 3;
    this.LEFT = 4;
    this.rule = {
      BLANK: [
        [this.BLANK, this.UP],
        [this.BLANK, this.RIGHT],
        [this.BLANK, this.DOWN],
        [this.BLANK, this.LEFT],
      ],
      UP: [
        //done
        [this.RIGHT, this.DOWN, this.LEFT],
        [this.UP, this.LEFT, this.DOWN],
        [this.BLANK, this.DOWN],
        [this.UP, this.RIGHT, this.DOWN],
      ],
      RIGHT: [
        //done
        [this.RIGHT, this.LEFT, this.DOWN],
        [this.LEFT, this.UP, this.DOWN],
        [this.RIGHT, this.LEFT, this.UP],
        [this.BLANK, this.LEFT],
      ],
      DOWN: [
        //done
        [this.BLANK, this.UP],
        [this.LEFT, this.UP, this.DOWN],
        [this.RIGHT, this.LEFT, this.UP],
        [this.RIGHT, this.UP, this.DOWN],
      ],
      LEFT: [
        //done
        [this.RIGHT, this.LEFT, this.DOWN],
        [this.BLANK, this.RIGHT],
        [this.RIGHT, this.LEFT, this.UP],
        [this.UP, this.DOWN, this.RIGHT],
      ],
    };
  }
  createGrid() {
    let tableHTML = "";
    for (let r = 0; r < this.height; r++) {
      let currentHTMLrow = `<tr id="row ${r}">`;
      for (let c = 0; c < this.width; c++) {
        let newNodeId = `${r}-${c}`,
          newNodeClass;
        newNodeClass = "unvisited";

        currentHTMLrow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
      }

      tableHTML += `${currentHTMLrow}</tr>`;
    }
    let board = document.getElementById("board");
    board.innerHTML = tableHTML;
    // print(this);
  }

  putClass(Class, i, j) {
    document.getElementById(`${i}-${j}`).className = Class;
    // print("DONE");
  }
  getEle = (i, j) => document.getElementById(`${i}-${j}`);
  check = (i, j) => i >= 0 && i < this.height && j >= 0 && j < this.width;
  init() {
    this.createGrid();

    for (let i = 0; i < this.height; i++) {
      const temp = [];
      for (let j = 0; j < this.width; j++) {
        temp.push({
          collapsed: false,
          state:false,
          options: [this.BLANK, this.UP, this.RIGHT, this.DOWN, this.LEFT],
        });
      }
      this.grid.push(temp);
    }

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let cell = this.grid[i][j];
        if (cell.collapsed) {
          let index = cell.options[0];
          this.putClass(this.Classes[index], i, j);
        } else {
          this.putClass("unvisited", i, j);
        }
      }
    }

    // this.grid[0].collapsed=true;
    // this.grid[0].options=[this.UP];

    // this.grid[2].options = [this.BLANK,this.UP];
    // this.grid[1].options = [this.BLANK,this.UP];
  }
  run() {
    this.init();

    const Cell = this.grid[0][0];
    print(Cell);
    Cell.collapsed = true;
    const Pick = Cell.options[Random(Cell.options.length)];
    this.putClass(this.Classes[Pick], 0, 0);

    this.Queue = [{ x: 0, y: 0 }];
    let f = 0;
    //print("be ready");
    let SET_INTER = setInterval(() => {
      const { x, y } = this.Queue.shift();
      //print(x, y);
      if (f == 0) {
        f = 1;
        //clearInterval(SET_INTER);
      } else {
        if (this.grid[x][y].collapsed == false) {
          let cnt = [0, 0, 0, 0, 0];
          let counter = 0;
          for (let r = 0; r < 4; r++) {
            const X = x + DR[r];
            const Y = y + DC[r];
            // this.putClass("w",X,Y);
            //print("X,Y", X, Y);
            if (this.check(X, Y))
              if (this.grid[X][Y].collapsed) {
                // print(
                //   `this.grid[${X} * this.width + ${Y}].collapsed = ${
                //     this.grid[X * this.width + Y].collapsed
                //   }`
                // );
                counter++;
                const Type = this.getEle(X, Y).className;
                const data = this.rule[Type][(r + 2) % 4];
                print("Type", Type);
                print("data", data);
                for (const iter of data) {
                  print("iter", iter);
                  cnt[iter]++;
                }
              }
          }
          print("cnt", cnt);
          print("counter", counter);

          const copyCnt = [];
          for (let r = 0; r < this.Classes.length; r++) {
            if (cnt[r] == counter) {
              copyCnt.push(r);
            }
          }
          const PickOne = copyCnt[Random(copyCnt.length)];
          print("PickOne", PickOne);
          this.getEle(x, y).className = this.Classes[PickOne];
          this.grid[x][y].collapsed = true;
          // clearInterval(SET_INTER);
        }
      }
      //print(x,y);
      //print("be ready");

      for (let r = 0; r < 4; r++) {
        const X = x + DR[r];
        const Y = y + DC[r];
        if (this.check(X, Y))
          if (this.grid[X][Y].collapsed == false && this.grid[X][Y].state==0) {
            //print(this.check(X, Y), this.getEle(X, Y).className);
            print(X, Y);
            this.grid[X][Y].state=1;
            // this.getEle(X,Y).className="x"
            this.Queue.push({ x: X, y: Y });
            print("*".repeat(20));
          }
      }
      if (this.Queue.length == 0) {
        clearInterval(SET_INTER);
      }
    }, 0);

    print("finished...");
  }
}
let NODE = (Class, ID) => {
  //`<td id="${ID}" class="${Class}"></td>`; //create new node "cell in table".
  let node = document.createElement("td");
  node.id = ID;
  node.className = Class;
  node.status = "normal";
  return node;
};

let obj = new waveFunctionCollapse(10, 10);
obj.run();
