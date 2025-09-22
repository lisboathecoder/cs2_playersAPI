import dados from "../models/dados.js"

const { players } = dados

const getAllPlayers = (req,res) => {
    const resultado = players;
        const { nick, nome, time, funcao, nacionalidade, ranking_hltv, sort } = req.query;

  if (sort === "ranking_asc") {
    // menor topo (1) → maior (70)
    resultado.sort((a, b) => a.ranking_hltv - b.ranking_hltv);
     res.json(resultado);
  } else if (sort === "ranking_desc") {
    // maior (70) → menor (1)
    resultado.sort((a, b) => b.ranking_hltv - a.ranking_hltv);
     res.json(resultado):
  }

    if(nick){
        resultado = resultado.filter(p => p.nick.toLowerCase().includes(nick.toLowerCase()));
    return res.json(resultado);
    };

    if(nacionalidade) {
        const resultado = players.filter(p => nacionalidade ? p.nacionalidade === nacionalidade : true);
        return res.json(resultado);
    };

    if(nome) {
        const resultado = players.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
        return res.json(resultado);
    };

    if(time){
        const resultado = players.filter(p => p.time.toLowerCase().includes(time.toLowerCase()))
        return res.json(resultado);
    }


    res.status(200).json({
        total: resultado.length,
        players: resultado
    });
};

const getByIdPlayers = (req,res) => {
    const id = parseInt(req.params.id);
    const player = players.find(p => p.id === id);
    if (!player){
        res.status(404).json({
            success: false,
            message: `Este id: ${id}, não foi encontrado`
        });
    } else {
        res.status(200).json({
            success: true,
            player: player
        });
    };
};

const createPlayer = (req,res) => {
    const { nick, nome, time, funcao, nacionalidade, ranking_hltv  } = req.body;
    if(!nome || !nick || !funcao || !nacionalidade){
        res.status(400).json({
            success: false,
            message: `Nick, nome, função e nacionalidade do player são obrigatórios!`
        });
    };

    if (players.some(p => p.nick === req.body.nick)) {
    return res.status(409).json({ error: "Nick já registrado." });
};

    const novoPlayer = {
        id: players.length + 1,
        nome,
        nick,
        time: time || "Sem time",
        funcao,
        nacionalidade,
        ranking_hltv: ranking_hltv || "Sem ranking"
    };

    players.push(novoPlayer)
    res.status(201).json({
        success: true,
        message: `Nova promessa no cenário!`,
        player: novoPlayer
    });
};

const deletePlayer= (req,res) => {
    const id = parseInt(req.params.id);
    const playerRemove = players.find(p => p.id === id);
        if(isNaN(id)){
        res.status(400).json({
            success: false,
            message: `O id deve ser válido`
        });
    };
    if(!playerRemove){
        return res.status(404).json({
            success: false,
            message: `O player não existe`
        });
    };
    const playerFiltrado = players.filter(p => p.id === playerRemove);
    players.splice(0, players.length, ...playerFiltrado);
    res.status(200).json({
        success: true,
        message: `Player removido com sucesso!`
    });
};

const updatePlayer = (req,res) => {
    const id = parseInt(req.params.id);
    const { nick, nome, time, funcao, nacionalidade, ranking_hltv  } = req.body;
        if(isNaN(id)){
        res.status(400).json({
            success: false,
            message: `O id deve ser válido`
        });
    };
    const playerExiste = players.find(p => p.id === id);
    if(!playerExiste){
           res.status(404).json({
      success: false,
      message: `Esse id não foi encontrado: ${id}`,
    });
  };
  const playerAtualizado = players.map(player => player.id === id 
    ?
    {
        ...(nick && { nick }),
        ...(nome && { nome }),
        ...(time && { time }),
        ...(funcao && { funcao }),
        ...(nacionalidade && { nacionalidade }),
        ...(ranking_hltv && { ranking_hltv })
    }
:player
);

players.splice(0, players.length, ...playerAtualizado);
const playerEditado = players.find(p => p.id === id);

res.status(200).json({
    success: true,
    message: `Player editado com sucesso!`,
    player: playerEditado
});
}

export { getAllPlayers, getByIdPlayers, createPlayer, deletePlayer, updatePlayer }