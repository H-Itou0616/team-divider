// 実行用メイン関数
function DivideTeams(){
    // テキストエリアから値を取得
    const textareaValue = document.getElementById("entrant").value;

    // 入力が空なら警告して処理中止
    if (!textareaValue.trim()){
        alert("参加者の名前を入力してください。");
        return;
    }

    // 取得した値を整頓する
    const members = textareaValue

    // 改行ごとで区切って行ごとの配列を作る
    .split("\n")
    // 空白を削除
    .map(name => name.trim())
    // 空行を削除
    .filter(name => name.length > 0);
    // 参加合計を取得
    const totalMembers=members.length;

    console.log("シャッフル前：",members);

    // オリジナルの配列を残すためにコピーしてからシャッフル
    const shuffledMembers = shuffle([...members]);
    
    console.log("シャッフル後：",shuffledMembers);

    // チーム数取得
    const numOfTeams=getNumOfTeams();
    console.log("チーム数：",numOfTeams);
    console.log("参加合計：",totalMembers);

    if (members.length < numOfTeams){
        alert(`参加者が${numOfTeams}チームに分けるには少なすぎます。`);
        return;
    }

    // 1チーム当たりに必要な人数と余り人数（観戦者）を算出
    const { membersPerTeam, extras} = calculateMembersPerTeam(totalMembers,numOfTeams);
    console.log("1チームに必要な人数：",membersPerTeam,"余り人数：",extras);

    const { teams, spectators } = assignMembersToTeams(shuffledMembers, numOfTeams, membersPerTeam, extras);
    console.log(teams);
    console.log("観戦者：",spectators);

    // 結果表示処理
    let resultTitle=`<h3>チーム分け結果</h3>`;
    let resultHtml="";  // 空の文字列を用意
        
        for (let i = 0; i < teams.length; i++){
        resultHtml += `<div class="team"><h3>チーム${i + 1}</h3><ul>`;
        for (let j = 0; j < teams[i].length; j++){
            resultHtml += `<li>${teams[i][j]}</li>`;
        }
        resultHtml += `</ul></div>`;
    }

    // 観戦者がいるかチェック
    if (spectators.length > 0){
        resultHtml += `<div class="spectator"><h3>観戦者</h3><ul>`;
        for (let i = 0; i < spectators.length; i++){
            resultHtml += `<li>${spectators[i]}</li>`;
        }
        resultHtml += `</ul></div>`;
    }
    // 結果用タイトル
    document.getElementById("result-title").innerHTML = resultTitle; 

    // 結果内容
    document.getElementById("result").innerHTML = resultHtml;

    // 結果までスクロール
    document.getElementById("result-title").scrollIntoView({ behavior: "smooth" });
}

// シャッフル用関数
function shuffle(array){
    for (let i=array.length - 1 ; i > 0; i--){
        // 0~iの間のランダムな整数を作る
        const j=Math.floor(Math.random() * (i + 1));
        // i番目とj番目の要素を交換する
        [array[i],array[j]] = [array[j],array[i]];
    }
    return array;
}

// チーム数取得用関数
function getNumOfTeams(){
    return Number(document.getElementById("num-of-team").value);
}

// 人数振り分け用関数
function calculateMembersPerTeam(totalMembers,numOfTeams){
    // 参加人数÷チーム数 math.floorで小数点を切り捨てる
    const membersPerTeam = Math.floor(totalMembers / numOfTeams);
    // 余り人数を算出
    const extras = totalMembers % numOfTeams;
    return { membersPerTeam, extras };
}

// メンバー振り分け用関数
function assignMembersToTeams(shuffledMembers, numOfTeams, membersPerTeam, extras){
    // 必要な分の空配列を作る
    const teams = Array.from({ length: numOfTeams }, () => []);
    // 観戦者用リスト
    const spectators = [];

    let memberIndex = 0;

    // チーム分けアルゴリズム
    // チーム数分ループ
    for (let i = 0; i < numOfTeams; i++){
        // 1チーム当たり必要な人数分ループ
        for (let j = 0; j < membersPerTeam; j++){
            // memberIndexが参加人数より小さければ処理
            if (memberIndex < shuffledMembers.length){
                // teams[i]にシャッフルされたメンバーを必要な分だけ最初から順に入れていく
                teams[i].push(shuffledMembers[memberIndex]);
                memberIndex++;
            }
        }
    }

    // 観戦者リスト作成
    for (let i = 0; i < extras; i++){
        if (memberIndex < shuffledMembers.length){
            spectators.push(shuffledMembers[memberIndex]);
            memberIndex++;
        }
    }

    return { teams, spectators };
}