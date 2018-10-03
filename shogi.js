"use strict";

const BOARD_SIZE = 9;
const KANZI_NUMBER = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]

let is_enemy_turn = false;
let now_piece_selected = false;
let now_look_next_turn = false;
let is_gameend = false;
let took_piece_selected = false;
let took_piece_data = null;
let taking_piece = null;
let placed_potision = null;
let is_gameend_count = 0;
let board_status_array = [];
let all_piece_can_move_data = [];
let took_piece_storage_array = [];
let all_piece_picture_array = [];
let now_check_piece = [];

all_piece_can_move_data = ["歩", "桂", "香", "銀", "金", "飛", "角", "王", "玉", "と金", "成桂", "成香", "成銀", "龍", "馬"];
all_piece_can_move_data["歩"] = [[0, -1]];
all_piece_can_move_data["桂"] = [[1, -2], [-1, -2]];
all_piece_can_move_data["香"] = [[0, -1]];
all_piece_can_move_data["銀"] = [[-1, -1], [0, -1], [1, -1], [-1, 1], [1, 1]];
all_piece_can_move_data["金"] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [0, 1]];
all_piece_can_move_data["飛"] = [[0, -1], [0, 1], [1, 0], [-1, 0]];
all_piece_can_move_data["角"] = [[-1, -1], [1, 1], [-1, 1,], [1, -1]];
all_piece_can_move_data["龍"] = all_piece_can_move_data["角"];
all_piece_can_move_data["馬"] = all_piece_can_move_data["飛"];
all_piece_can_move_data["王"] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
all_piece_can_move_data["玉"] = all_piece_can_move_data["王"];
all_piece_can_move_data["と金"] = all_piece_can_move_data["金"];
all_piece_can_move_data["成桂"] = all_piece_can_move_data["金"];
all_piece_can_move_data["成香"] = all_piece_can_move_data["金"];
all_piece_can_move_data["成銀"] = all_piece_can_move_data["金"];

all_piece_picture_array = ["歩", "桂", "香", "銀", "金", "飛", "角", "王", "玉", "と金", "成桂", "成香", "成銀", "龍", "馬"];
for (let i = 0; i < all_piece_picture_array.length; ++i) {
    all_piece_picture_array[all_piece_picture_array[i]] = new Image();
};
all_piece_picture_array["歩"].src = "syougi14_fuhyou.png";
all_piece_picture_array["桂"].src = "syougi10_keima.png";
all_piece_picture_array["香"].src = "syougi12_kyousya.png";
all_piece_picture_array["銀"].src = "syougi08_ginsyou.png";
all_piece_picture_array["金"].src = "syougi07_kinsyou.png";
all_piece_picture_array["飛"].src = "syougi03_hisya.png";
all_piece_picture_array["角"].src = "syougi05_gakugyou.png";
all_piece_picture_array["王"].src = "syougi01_ousyou.png";
all_piece_picture_array["玉"].src = "syougi02_gyokusyou.png";
all_piece_picture_array["と金"].src = "syougi15_tokin.png";
all_piece_picture_array["成桂"].src = "syougi11_narikei.png";
all_piece_picture_array["成香"].src = "syougi13_narikyou.png";
all_piece_picture_array["成銀"].src = "syougi09_narigin.png";
all_piece_picture_array["龍"].src = "syougi04_ryuuou.png";
all_piece_picture_array["馬"].src = "syougi06_ryuuma.png";


took_piece_storage_array = ["歩", "桂", "香", "銀", "金", "飛", "角", "王", "玉"];//["歩", "桂", "香", "銀", "金", "飛", "角"]のそれぞれの駒に
for (let i = 0; i < took_piece_storage_array.length; ++i) {                     //[味方,敵]という感じにお互いの所持枚数が入ってる。
    took_piece_storage_array[took_piece_storage_array[i]] = [0, 0];
};

function board_array_create() {
    for (let y = 0; y < BOARD_SIZE; ++y) {
        let line = [];
        for (let x = 0; x < BOARD_SIZE; ++x) {
            line.push([]);
        };
        board_status_array.push(line);
    };
};

function clear_all_class(classname) {
    let class_length = document.getElementsByClassName(classname).length;
    for (let i = 0; i < class_length; ++i) {
        document.getElementsByClassName(classname)[0].classList.remove(classname);
    };
};

function clear_all_board_can_put_data(board_data_array) {
    for (let y = 0; y < BOARD_SIZE; ++y) {
        for (let x = 0; x < BOARD_SIZE; ++x) {
            if (board_data_array[y][x][0] === "true" || board_data_array[y][x][0] === "false") {
                board_data_array[y][x].shift();
            };
        };
    };
};

function promotion_piece() {
    switch (took_piece_data[0]) {
        case "歩":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "と金";
            };
            break;

        case "桂":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "成桂";
            };
            break;

        case "香":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "成香";
            };
            break;

        case "銀":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "成銀";
            };
            break;

        case "飛":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "龍";
            };
            break;

        case "角":
            if (confirm("成りますか？")) {
                took_piece_data[0] = "馬";
            };
    };
};

let next_game_process = () => {
    let next_game = confirm("次の試合をしますか？");
    if (next_game) {
        location.href = location.href;
    };
};

function avoid_gameend(piece_coordinate, piece_id) {
    now_look_next_turn = true;
    let now_king_position = {
        y: null,
        x: null
    };

    let next_turn_board_status_array = JSON.parse(JSON.stringify(board_status_array));
    can_put_if_put(piece_coordinate, piece_id, next_turn_board_status_array);
    clear_all_board_can_put_data(next_turn_board_status_array);

    for (let y = 0; y < BOARD_SIZE; ++y) {
        for (let x = 0; x < BOARD_SIZE; ++x) {
            if (is_enemy_turn === false) {
                if (JSON.stringify(next_turn_board_status_array[y][x]) === JSON.stringify(["王", "味方"])) {
                    now_king_position.y = y;
                    now_king_position.x = x;
                    break;
                };
            }
            else if (is_enemy_turn === true) {
                if (JSON.stringify(next_turn_board_status_array[y][x]) === JSON.stringify(["玉", "敵"])) {
                    now_king_position.y = y;
                    now_king_position.x = x;
                    break;
                };
            };
        };
    };

    for (let y = 0; y < BOARD_SIZE; ++y) {
        for (let x = 0; x < BOARD_SIZE; ++x) {
            if (is_enemy_turn === false) {
                if (next_turn_board_status_array[y][x][1] === "敵") {
                    let piece_coordinate = {
                        y: y,
                        x: x
                    }

                    can_put_location_display(piece_coordinate, next_turn_board_status_array[y][x][0], next_turn_board_status_array);
                    if (is_gameend === false) {
                        if (next_turn_board_status_array[now_king_position.y][now_king_position.x][0] === "false") {
                            is_gameend = false;
                        }
                        else if (next_turn_board_status_array[now_king_position.y][now_king_position.x][0] === "true") {
                            is_gameend = true;
                        };
                    };
                    clear_all_board_can_put_data(next_turn_board_status_array);
                };
            }
            else if (is_enemy_turn === true) {
                if (next_turn_board_status_array[y][x][1] === "味方") {
                    let piece_coordinate = {
                        y: y,
                        x: x
                    }

                    can_put_location_display(piece_coordinate, next_turn_board_status_array[y][x][0], next_turn_board_status_array);
                    if (is_gameend === false) {
                        if (next_turn_board_status_array[now_king_position.y][now_king_position.x][0] === "false") {
                            is_gameend = false;
                        }
                        else if (next_turn_board_status_array[now_king_position.y][now_king_position.x][0] === "true") {
                            is_gameend = true;
                        };
                    };
                    clear_all_board_can_put_data(next_turn_board_status_array);
                };
            };
        };
    };
};

function can_put_location_display(piece_coordinate, piece_name, board_data_array) {
    if (piece_name === undefined) {
    }
    else {
        if (["飛", "角", "香"].includes(piece_name)) {
            for (let i = 0; i < all_piece_can_move_data[piece_name].length; ++i) {
                for (let to_edge = 1; to_edge <= BOARD_SIZE; ++to_edge) {
                    //端までは最大でも8マスなため、その分繰り返している。
                    if (board_data_array[piece_coordinate.y][piece_coordinate.x][1] === "味方") {

                        let target_coordinate = {
                            y: piece_coordinate.y + all_piece_can_move_data[piece_name][i][1] * to_edge,
                            x: piece_coordinate.x + all_piece_can_move_data[piece_name][i][0] * to_edge
                        };

                        if (target_coordinate.y >= BOARD_SIZE || target_coordinate.y < 0)
                            continue;

                        if (target_coordinate.x >= BOARD_SIZE || target_coordinate.x < 0)
                            continue;


                        let target_cell_id = target_coordinate.y + "_" + target_coordinate.x

                        if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "味方") {
                            document.getElementById(target_cell_id).classList.add("ally_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("false");
                            break;
                        }
                        else if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "敵") {
                            document.getElementById(target_cell_id).classList.add("enemy_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                            break;
                        }
                        else {
                            document.getElementById(target_cell_id).classList.add("no_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                        };
                    }
                    else if (board_data_array[piece_coordinate.y][piece_coordinate.x][1] === "敵") {

                        let target_coordinate = {
                            y: piece_coordinate.y - all_piece_can_move_data[piece_name][i][1] * to_edge,
                            x: piece_coordinate.x + all_piece_can_move_data[piece_name][i][0] * to_edge
                        };

                        if (target_coordinate.y >= BOARD_SIZE || target_coordinate.y < 0)
                            continue;

                        if (target_coordinate.x >= BOARD_SIZE || target_coordinate.x < 0)
                            continue;

                        let target_cell_id = target_coordinate.y + "_" + target_coordinate.x

                        if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "敵") {
                            document.getElementById(target_cell_id).classList.add("ally_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("false");
                            break;
                        }
                        else if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "味方") {
                            document.getElementById(target_cell_id).classList.add("enemy_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                            break;
                        }
                        else {
                            document.getElementById(target_cell_id).classList.add("no_piece_color");
                            board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                        };
                    };
                };
            };
        }
        else {
            for (let i = 0; i < all_piece_can_move_data[piece_name].length; ++i) {
                if (board_data_array[piece_coordinate.y][piece_coordinate.x][1] === "味方") {

                    let target_coordinate = {
                        y: piece_coordinate.y + all_piece_can_move_data[piece_name][i][1],
                        x: piece_coordinate.x + all_piece_can_move_data[piece_name][i][0]
                    };

                    if (target_coordinate.y >= BOARD_SIZE || target_coordinate.y < 0)
                        continue;
                    if (target_coordinate.x >= BOARD_SIZE || target_coordinate.x < 0)
                        continue;

                    let target_cell_id = target_coordinate.y + "_" + target_coordinate.x

                    if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "味方") {
                        document.getElementById(target_cell_id).classList.add("ally_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("false");
                    }
                    else if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "敵") {
                        document.getElementById(target_cell_id).classList.add("enemy_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                    }
                    else {
                        document.getElementById(target_cell_id).classList.add("no_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                    };
                }
                else if (board_data_array[piece_coordinate.y][piece_coordinate.x][1] === "敵") {

                    let target_coordinate = {
                        y: piece_coordinate.y - all_piece_can_move_data[piece_name][i][1],
                        x: piece_coordinate.x + all_piece_can_move_data[piece_name][i][0]
                    };

                    if (target_coordinate.y >= BOARD_SIZE || target_coordinate.y < 0)
                        continue;
                    if (target_coordinate.x >= BOARD_SIZE || target_coordinate.x < 0)
                        continue;

                    let target_cell_id = target_coordinate.y + "_" + target_coordinate.x

                    if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "敵") {
                        document.getElementById(target_cell_id).classList.add("ally_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("false");
                    }
                    else if (board_data_array[target_coordinate.y][target_coordinate.x][1] === "味方") {
                        document.getElementById(target_cell_id).classList.add("enemy_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                    }
                    else {
                        document.getElementById(target_cell_id).classList.add("no_piece_color");
                        board_data_array[target_coordinate.y][target_coordinate.x].unshift("true");
                    };
                };
            };
            if (["龍", "馬"].includes(piece_name)) {
                if (piece_name === "龍")
                    piece_name = "飛";
                else if (piece_name === "馬")
                    piece_name = "角";

                can_put_location_display(piece_coordinate, piece_name, board_data_array);
            };
        };
        for (let y = 0; y < BOARD_SIZE; ++y) {
            for (let x = 0; x < BOARD_SIZE; ++x) {
                if (board_data_array[y][x][0] !== "true" && board_data_array[y][x][0] !== "false") {
                    document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                    board_data_array[y][x].unshift("false");
                };
            };
        };
    };
};

function took_piece_can_put_location_display(took_piece_data) {
    if (took_piece_data[1] === "味方") {
        if (took_piece_storage_array[took_piece_data[0]][0] === 0) {
            alert("その駒は持っていません");
        }
        else {
            for (let y = 0; y < BOARD_SIZE; ++y) {
                for (let x = 0; x < BOARD_SIZE; ++x) {
                    let target_cell_id = y + "_" + x
                    if (board_status_array[y][x][1] === "味方") {
                        document.getElementById(target_cell_id).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].unshift("false");
                    }
                    else if (board_status_array[y][x][1] === "敵") {
                        document.getElementById(target_cell_id).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].unshift("false");
                    }
                    else {
                        document.getElementById(target_cell_id).classList.add("no_piece_color");
                        board_status_array[y][x].unshift("true");
                    };
                };
            };
            if (took_piece_data[0] === "歩") {
                for (let y = 0; y < BOARD_SIZE; ++y) {
                    for (let x = 0; x < BOARD_SIZE; ++x) {
                        if (board_status_array[y][x][1] === "歩" && board_status_array[y][x][2] === "味方") {
                            for (let column = 0; column < BOARD_SIZE; ++column) {
                                document.getElementById(`${column}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                                document.getElementById(`${column}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                                board_status_array[column][x].shift();
                                board_status_array[column][x].unshift("false");
                            };
                        };
                    };
                };
            };
            if (["歩", "香"].includes(took_piece_data[0])) {
                for (let x = 0; x < BOARD_SIZE; ++x) {
                    if (took_piece_data[1] === "味方") {
                        let y = 0;
                        document.getElementById(`${y}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                        document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].shift();
                        board_status_array[y][x].unshift("false");
                    }
                    else if (took_piece_data[1] === "敵") {
                        let y = 8;
                        document.getElementById(`${y}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                        document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].shift();
                        board_status_array[y][x].unshift("false");
                    };
                };
            }
            else if (took_piece_data[0] === "桂") {
                for (let y = 1; y >= 0; --y) {//桂馬は端列の2マスが行き所のない駒となるため
                    for (let x = 0; x < BOARD_SIZE; ++x) {
                        document.getElementById(`${y}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                        document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].shift();
                        board_status_array[y][x].unshift("false");
                    };
                };
            };
        };
    }
    else if (took_piece_data[1] === "敵") {
        if (took_piece_storage_array[took_piece_data[0]][1] === 0) {
            alert("その駒は持っていません");
        }
        else {
            for (let y = 0; y < BOARD_SIZE; ++y) {
                for (let x = 0; x < BOARD_SIZE; ++x) {
                    let target_cell_id = y + "_" + x
                    if (board_status_array[y][x][1] === "敵") {
                        document.getElementById(target_cell_id).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].unshift("false");
                    }
                    else if (board_status_array[y][x][1] === "味方") {
                        document.getElementById(target_cell_id).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].unshift("false");
                    }
                    else {
                        document.getElementById(target_cell_id).classList.add("no_piece_color");
                        board_status_array[y][x].unshift("true");
                    };
                };
            };
            if (took_piece_data[0] === "歩") {
                for (let y = 0; y < BOARD_SIZE; ++y) {
                    for (let x = 0; x < BOARD_SIZE; ++x) {
                        if (board_status_array[y][x][1] === "歩" && board_status_array[y][x][2] === "敵") {
                            for (let column = 0; column < BOARD_SIZE; ++column) {
                                document.getElementById(`${column}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                                document.getElementById(`${column}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                                board_status_array[column][x].shift();
                                board_status_array[column][x].unshift("false");
                            };
                        };
                    };
                };
            };
            if (["歩", "香"].includes(took_piece_data[0])) {
                for (let x = 0; x < BOARD_SIZE; ++x) {
                    let y = 8;
                    document.getElementById(`${y}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                    document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                    board_status_array[y][x].shift();
                    board_status_array[y][x].unshift("false");
                };
            }
            else if (took_piece_data[0] === "桂") {
                for (let y = 7; y < BOARD_SIZE; ++y) {//桂馬は端列の2マスが行き所のない駒となるため
                    for (let x = 0; x < BOARD_SIZE; ++x) {
                        document.getElementById(`${y}` + "_" + `${x}`).classList.remove("no_piece_color", "cant_put_by_rules_color");
                        document.getElementById(`${y}` + "_" + `${x}`).classList.add("cant_put_by_rules_color");
                        board_status_array[y][x].shift();
                        board_status_array[y][x].unshift("false");
                    };
                };
            };
        };
    };
};

function can_put_if_put(piece_coordinate, piece_id, board_data_array) {
    if (is_enemy_turn === false) {
        if (took_piece_data[1] === "味方") {
            if (board_data_array[piece_coordinate.y][piece_coordinate.x].length === 0) {
            }
            else {
                if (took_piece_selected === false) {
                    if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {
                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                clear_all_board_can_put_data(board_status_array);
                                return;
                            };
                        };

                        board_data_array[placed_potision.y][placed_potision.x].splice(1, 3);

                        if (now_look_next_turn === false) {
                            if (piece_coordinate.y < 3) {
                                if (piece_coordinate.y === 0) {
                                    switch (took_piece_data[0]) {
                                        case "歩":
                                            took_piece_data[0] = "と金";
                                            break;

                                        case "桂":
                                            took_piece_data[0] = "成桂";
                                            break;

                                        case "香":
                                            took_piece_data[0] = "成香";
                                            break;
                                        default:
                                            promotion_piece();
                                    };
                                }
                                else {
                                    promotion_piece();
                                };
                            }
                            else if (["歩", "桂", "香", "銀", "飛", "角"].includes(took_piece_data[0])) {
                                if (placed_potision.y < 3) {
                                    promotion_piece();
                                };
                            };
                        };

                        Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));
                        if (now_look_next_turn === false) {
                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "▲" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };
                    }
                    else if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === "敵" && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {
                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                return;
                            };
                        };
                        board_data_array[placed_potision.y][placed_potision.x].splice(1, 3);
                        taking_piece = board_data_array[piece_coordinate.y][piece_coordinate.x].splice(0, 3);

                        switch (taking_piece[1]) {
                            case "と金":
                                taking_piece[1] = "歩";
                                taking_piece[2] = "味方";
                                break;
                            case "成桂":
                                taking_piece[1] = "桂";
                                taking_piece[2] = "味方";
                                break;
                            case "成香":
                                taking_piece[1] = "香";
                                taking_piece[2] = "味方";
                            case "成銀":
                                taking_piece[1] = "銀";
                                taking_piece[2] = "味方";
                                break;
                            case "龍":
                                taking_piece[1] = "飛";
                                taking_piece[2] = "味方";
                                break;
                            case "馬":
                                taking_piece[1] = "角";
                                taking_piece[2] = "味方";

                                break;
                            default:
                                taking_piece.pop();
                                taking_piece.push("敵");
                                break;
                        };

                        if (now_look_next_turn === false) {
                            if (piece_coordinate.y < 3) {
                                if (piece_coordinate.y === 0) {
                                    switch (took_piece_data[0]) {
                                        case "歩":
                                            took_piece_data[0] = "と金";
                                            break;

                                        case "桂":
                                            took_piece_data[0] = "成桂";
                                            break;

                                        case "香":
                                            took_piece_data[0] = "成香";
                                            break;
                                        default:
                                            promotion_piece();
                                    };
                                }
                                else {
                                    promotion_piece();
                                };
                            }
                            if (["歩", "桂", "香", "銀", "飛", "角"].includes(took_piece_data[0])) {
                                if (placed_potision.y < 3) {
                                    promotion_piece();
                                };
                            };
                        };

                        Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));

                        let storage_divide_id = taking_piece[1] + "_味方_storage";

                        if (now_look_next_turn === false) {
                            took_piece_storage_array[taking_piece[1]][0] += 1
                            document.getElementById(storage_divide_id).lastElementChild.innerHTML = took_piece_storage_array[taking_piece[1]][0];
                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "▲" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };
                    };
                }
                else {
                    if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {
                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                return;
                            };
                        };
                        let storage_id = took_piece_data[0] + "_味方_storage";

                        if (now_look_next_turn === false) {
                            Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));
                            took_piece_storage_array[took_piece_data[0]][0] -= 1
                            document.getElementById(storage_id).lastElementChild.innerHTML = took_piece_storage_array[took_piece_data[0]][0];

                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "▲" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };
                    };
                };
            };
        }
        else {
            if (document.getElementById(piece_id).classList.length === 0) {
            }
            else {
                if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                    alert("それは敵の駒のため動かせません");
                };
            };
        };
    }
    else {
        if (took_piece_data[1] === "敵") {
            if (board_data_array[piece_coordinate.y][piece_coordinate.x].length === 0) {
            }
            else {
                if (took_piece_selected === false) {
                    if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {
                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                is_gameend_count += 1;
                                return;
                            };
                        };

                        board_data_array[placed_potision.y][placed_potision.x].splice(1, 3);

                        if (now_look_next_turn === false) {
                            if (piece_coordinate.y > 5) {
                                if (piece_coordinate.y === 8) {
                                    switch (took_piece_data[0]) {
                                        case "歩":
                                            took_piece_data[0] = "と金";
                                            break;

                                        case "桂":
                                            took_piece_data[0] = "成桂";
                                            break;

                                        case "香":
                                            took_piece_data[0] = "成香";
                                            break;
                                        default:
                                            promotion_piece();
                                    };
                                }
                                else {
                                    promotion_piece();
                                };
                            }
                            if (["歩", "桂", "香", "銀", "金", "飛", "角"].includes(took_piece_data[0])) {
                                if (placed_potision.y > 5) {
                                    promotion_piece();
                                };
                            };
                        };

                        Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));
                        if (now_look_next_turn === false) {
                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "△" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };
                    }

                    else if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === "味方" && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {

                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                is_gameend_count += 1;
                                return;
                            };
                        };

                        board_data_array[placed_potision.y][placed_potision.x].splice(1, 3);
                        taking_piece = board_data_array[piece_coordinate.y][piece_coordinate.x].splice(0, 3);
                        switch (taking_piece[1]) {
                            case "と金":
                                taking_piece[1] = "歩";
                                taking_piece[2] = "敵";
                                break;
                            case "成桂":
                                taking_piece[1] = "桂";
                                taking_piece[2] = "敵";
                                break;
                            case "成香":
                                taking_piece[1] = "香";
                                taking_piece[2] = "敵";
                            case "成銀":
                                taking_piece[1] = "銀";
                                taking_piece[2] = "敵";
                                break;
                            case "龍":
                                taking_piece[1] = "飛";
                                taking_piece[2] = "敵";
                                break;
                            case "馬":
                                taking_piece[1] = "角";
                                taking_piece[2] = "敵";
                                break;
                            default:
                                taking_piece.pop();
                                taking_piece.push("敵");
                                break;
                        };

                        if (now_look_next_turn === false) {
                            if (piece_coordinate.y > 5) {
                                if (piece_coordinate.y === 8) {
                                    switch (took_piece_data[0]) {
                                        case "歩":
                                            took_piece_data[0] = "と金";
                                            break;

                                        case "桂":
                                            took_piece_data[0] = "成桂";
                                            break;

                                        case "香":
                                            took_piece_data[0] = "成香";
                                            break;
                                        default:
                                            promotion_piece();
                                    };
                                }
                                else {
                                    promotion_piece();
                                };
                            }
                            if (["歩", "桂", "香", "銀", "金", "飛", "角"].includes(took_piece_data[0])) {
                                if (placed_potision.y > 5) {
                                    promotion_piece();
                                };
                            };
                        };

                        Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));
                        let storage_divide_id = taking_piece[1] + "_敵_storage";

                        if (now_look_next_turn === false) {
                            took_piece_storage_array[taking_piece[1]][1] += 1
                            document.getElementById(storage_divide_id).lastElementChild.innerHTML = took_piece_storage_array[taking_piece[1]][1];
                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "△" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };
                    };
                }
                else {
                    if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                        if (now_look_next_turn === false) {
                            avoid_gameend(piece_coordinate, piece_id);
                            now_look_next_turn = false;
                            if (is_gameend === true) {
                                alert("王手です");
                                is_gameend_count += 1;
                                return;
                            };
                        };
                        let storage_id = took_piece_data[0] + "_敵_storage";

                        if (now_look_next_turn === false) {
                            Array.prototype.push.apply((board_data_array[piece_coordinate.y][piece_coordinate.x]), (took_piece_data));
                            took_piece_storage_array[took_piece_data[0]][1] -= 1
                            document.getElementById(storage_id).lastElementChild.innerHTML = took_piece_storage_array[took_piece_data[0]][1];
                            document.getElementById("record_of_game_index").innerHTML += "<br>" + "△" + KANZI_NUMBER[piece_coordinate.y + 1] + (BOARD_SIZE - piece_coordinate.x) + took_piece_data[0];
                            is_gameend_count = 0;
                            is_enemy_turn = !is_enemy_turn;
                        };

                    };
                };
            };
        }
        else {
            if (document.getElementById(piece_id).classList.length === 0) {
            }
            else {
                if (board_data_array[piece_coordinate.y][piece_coordinate.x][2] === undefined && board_data_array[piece_coordinate.y][piece_coordinate.x][0] === "true") {
                    alert("それは敵の駒のため動かせません");
                };
            };
        };
    };
};

function took_piece_selecte_process(e) {
    if (now_piece_selected === false) {
        took_piece_selected = true;
        move_piece(e);
    }
    else {
        clear_all_class("no_piece_color");
        clear_all_class("ally_piece_color");
        clear_all_class("enemy_piece_color");
        clear_all_class("cant_put_by_rules_color");
        clear_all_board_can_put_data(board_status_array);

        now_piece_selected = false;
        took_piece_selected = false;
        insertion_array_data_to_board();
    };
};

function move_piece(e) {
    if (is_gameend_count < 5) {
        if (took_piece_selected === false) {

            let piece_id = e.target.id || e.target.parentElement.id;

            let piece_coordinate = {
                y: parseInt(piece_id.slice(0, 1)),
                x: parseInt(piece_id.slice(2, 3))
            };

            let piece_name = board_status_array[piece_coordinate.y][piece_coordinate.x][0];

            if (now_piece_selected === false) {

                // exists_check(board_status_array);
                can_put_location_display(piece_coordinate, piece_name, board_status_array);
                now_piece_selected = true;
                took_piece_data = board_status_array[piece_coordinate.y][piece_coordinate.x].slice(1, 3);

                placed_potision = {
                    y: piece_coordinate.y,
                    x: piece_coordinate.x
                };
            }
            else {
                can_put_if_put(piece_coordinate, piece_id, board_status_array);
                clear_all_class("no_piece_color");
                clear_all_class("ally_piece_color");
                clear_all_class("enemy_piece_color");
                clear_all_class("cant_put_by_rules_color")
                clear_all_board_can_put_data(board_status_array);


                now_piece_selected = false;
                is_gameend = false;
                insertion_array_data_to_board();
            };
        }
        else {
            if (now_piece_selected === false) {
                let took_piece_id = e.target.id || e.target.parentElement.id;
                // exists_check(board_status_array);
                if (took_piece_id[2] === "味") {
                    took_piece_data = took_piece_id.slice(0, 4).split("_");
                }
                else {
                    took_piece_data = took_piece_id.slice(0, 3).split("_");
                };
                clear_all_board_can_put_data(board_status_array);
                took_piece_can_put_location_display(took_piece_data);
                now_piece_selected = true;
            }
            else {
                let piece_id = e.target.id || e.target.parentElement.id;

                let piece_coordinate = {
                    y: parseInt(piece_id.slice(0, 1)),
                    x: parseInt(piece_id.slice(2, 3))
                };

                can_put_if_put(piece_coordinate, piece_id, board_status_array);
                clear_all_class("no_piece_color");
                clear_all_class("ally_piece_color");
                clear_all_class("enemy_piece_color");
                clear_all_class("cant_put_by_rules_color");
                clear_all_board_can_put_data(board_status_array);

                now_piece_selected = false;
                took_piece_selected = false;
                is_gameend === false;
                insertion_array_data_to_board();
            };
        };
    }
    else {
        if (is_enemy_turn === false) {
            alert("後手の勝ちです");

            let next_game = confirm("次の試合をしますか？");
            if (next_game) {
                location.href = location.href;
            }
            else {
                document.getElementById("next_game_button").style.display = "block";
            };
        }
        else if (is_enemy_turn === true) {
            alert("先手の勝ちです");

            let next_game = confirm("次の試合をしますか？");
            if (next_game) {
                location.href = location.href;
            }
            else {
                document.getElementById("next_game_button").style.display = "block";
            };
        };
    };
};


function initialization_board_array() {

    /*\
    | | @yanorei32's code
    | |
    let conversionToEnemyPosition = (pos) => {
        return {
            x: -pos.x + (BOARD_SIZE-1),
            y: -pos.y + (BOARD_SIZE-1),
        };
    };
 
    let setNewPiece = (pos, piece) => {
        board_status_array[pos.y][pos.x] = [ piece, "敵" ];
        pos = conversionToEnemyPosition(pos);
        board_status_array[pos.y][pos.x] = [ piece, "味方" ];
    };
 
    let pieces = ["王", "金", "銀", "桂", "香"];
 
    for(let i = 0; i < pieces.length;i++){
        let pos = { y: 0 };
 
        pos.x = Math.floor(BOARD_SIZE / 2) - i;
        setNewPiece(pos, pieces[i]);
 
        pos.x = Math.floor(BOARD_SIZE / 2) + i;
        setNewPiece(pos, pieces[i]);
 
    }
 
    setNewPiece({y: 1, x: 1}, "飛");
    setNewPiece({y: 1, x: 7}, "角");
 
    for(let i = 0; i < BOARD_SIZE; i++)
        setNewPiece({y: 2, x: i}, "歩");
    | |
    | |
    \*/

    for (let y = 0; y < BOARD_SIZE; ++y) {
        for (let x = 0; x < BOARD_SIZE; ++x) {
            if (y === 0) {
                if (x === 0 || x === 8) {
                    board_status_array[y][x] = ["香", "敵"];
                }
                else if (x === 1 || x === 7) {
                    board_status_array[y][x] = ["桂", "敵"];
                }
                else if (x === 2 || x === 6) {
                    board_status_array[y][x] = ["銀", "敵"];
                }
                else if (x === 3 || x === 5) {
                    board_status_array[y][x] = ["金", "敵"];
                }
                else {
                    board_status_array[y][x] = ["玉", "敵"];
                };
            }
            else if (y === 1) {
                if (x === 1) {
                    board_status_array[y][x] = ["飛", "敵"];
                }
                else if (x === 7) {
                    board_status_array[y][x] = ["角", "敵"];
                };
            }
            else if (y === 2) {
                board_status_array[y][x] = ["歩", "敵"];
            }
            else if (y === 6) {
                board_status_array[y][x] = ["歩", "味方"];
            }
            else if (y === 7) {
                if (x === 1) {
                    board_status_array[y][x] = ["角", "味方"];
                }
                else if (x === 7) {
                    board_status_array[y][x] = ["飛", "味方"];
                };
            }
            else if (y === 8) {
                if (x === 0 || x === 8) {
                    board_status_array[y][x] = ["香", "味方"];
                }
                else if (x === 1 || x === 7) {
                    board_status_array[y][x] = ["桂", "味方"];
                }
                else if (x === 2 || x === 6) {
                    board_status_array[y][x] = ["銀", "味方"];
                }
                else if (x === 3 || x === 5) {
                    board_status_array[y][x] = ["金", "味方"];
                }
                else {
                    board_status_array[y][x] = ["王", "味方"];
                };
            };
        };
    };
};

function board_create() {
    for (let y = 0; y < BOARD_SIZE + 1; ++y) {

        let html_tr = document.createElement("tr");

        if (y === 0) {
            for (let i = 0; i < BOARD_SIZE; i++) {
                let html_th = document.createElement("th");
                html_th.innerHTML = (9 - i) + "";
                html_tr.appendChild(html_th);
            }

            let html_th = document.createElement("th");
            html_tr.appendChild(html_th);

        } else {
            for (let x = 0; x < BOARD_SIZE; ++x) {
                let html_td = document.createElement("td");

                html_td.id = `${y - 1}` + "_" + `${x}`;
                html_tr.appendChild(html_td);
            };
            let html_th = document.createElement("th");

            html_th.innerHTML = KANZI_NUMBER[y];
            html_tr.appendChild(html_th);
        };
        shogi_board.appendChild(html_tr);
    };
    document.getElementById("next_game_button").addEventListener("click", next_game_process, false);
};

function piece_table_create() {
    for (let y = 0; y < 3; ++y) {

        let html_tr = document.createElement("tr");

        for (let x = 0; x < 3; ++x) {
            let html_td = document.createElement("td");
            let html_p = document.createElement("p");
            let html_img = document.createElement("img");

            //3は持ち駒のtableが3×3なため、0列目、1列目、2列目で3かけている。
            html_td.id = all_piece_can_move_data[y * 3 + x] + "_味方_storage";
            html_td.addEventListener("click", took_piece_selecte_process, false);
            html_img.src = all_piece_picture_array[all_piece_can_move_data[y * 3 + x]].src;
            html_p.innerHTML = "0";
            html_td.appendChild(html_img);
            html_td.appendChild(html_p);
            html_tr.appendChild(html_td);
        };
        white_piece_table.appendChild(html_tr);
    };
    for (let y = 0; y < 3; ++y) {

        let html_tr = document.createElement("tr");

        for (let x = 0; x < 3; ++x) {
            let html_td = document.createElement("td");
            let html_img = document.createElement("img");
            let html_p = document.createElement("p");

            //3は持ち駒のtableが3×3なため、0列目、1列目、2列目で3かけている。
            //8から引き算しているのは、歩から玉まで0~8で、見た目のために敵の並び順を変えるということで引いている。
            html_td.id = all_piece_can_move_data[8 - (y * 3 + x)] + "_敵_storage";
            html_td.addEventListener("click", took_piece_selecte_process, false);
            html_img.src = all_piece_picture_array[all_piece_can_move_data[8 - (y * 3 + x)]].src;
            html_img.classList.add("enemy")
            html_p.innerHTML = "0";
            html_td.appendChild(html_img);
            html_td.appendChild(html_p);
            html_tr.appendChild(html_td);
        };
        black_piece_table.appendChild(html_tr);
    };
};

function insertion_array_data_to_board() {
    for (let y = 0; y < BOARD_SIZE; ++y) {
        for (let x = 0; x < BOARD_SIZE; ++x) {
            if (board_status_array[y][x].length !== 0) {
                let html_img = document.createElement("img");
                html_img.src = all_piece_picture_array[board_status_array[y][x][0]].src;
                if (board_status_array[y][x][1] === "敵") {
                    html_img.classList.add("enemy");
                }
                else {
                    if (html_img.classList.contains("enemy")) {
                        html_img.classList.remove("enemy");
                    };
                };

                if (document.getElementById(`${y}` + "_" + `${x}`).children.length !== 0) {
                    document.getElementById(`${y}` + "_" + `${x}`).removeChild(document.getElementById(`${y}` + "_" + `${x}`).firstElementChild);
                };

                document.getElementById(`${y}` + "_" + `${x}`).appendChild(html_img);
                document.getElementById(`${y}` + "_" + `${x}`).addEventListener("click", move_piece, false);
            }
            else {
                if (document.getElementById(`${y}` + "_" + `${x}`).children.length !== 0) {
                    document.getElementById(`${y}` + "_" + `${x}`).removeChild(document.getElementById(`${y}` + "_" + `${x}`).firstElementChild);
                };
                document.getElementById(`${y}` + "_" + `${x}`).addEventListener("click", move_piece, false);
                if (document.getElementById(`${y}` + "_" + `${x}`).classList.contains("enemy")) {
                    document.getElementById(`${y}` + "_" + `${x}`).firstElementChild.classList.remove("enemy")
                };
            };
        };
    };
    if (is_enemy_turn === false) {
        document.getElementById("black_turn_display").style.backgroundColor = "blue";
        document.getElementById("white_turn_display").style.backgroundColor = "";
    }
    else if (is_enemy_turn === true) {
        document.getElementById("black_turn_display").style.backgroundColor = "";
        document.getElementById("white_turn_display").style.backgroundColor = "blue";
    };
};

board_array_create();
initialization_board_array();
board_create();
piece_table_create();
insertion_array_data_to_board();