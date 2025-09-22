import dados from "../models/dados.js"

const { players } = dados

const getAllPlayers = (req, res) => {
    let resultado = players;
    const { nick, nome, time, funcao, nacionalidade, ranking_hltv, sort } = req.query;

    // Filtros
    if(nick) {
        resultado = resultado.filter(p => p.nick.toLowerCase().includes(nick.toLowerCase()));
    }
    if(nome) {
        resultado = resultado.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
    }
    if(time) {
        resultado = resultado.filter(p => p.time.toLowerCase().includes(time.toLowerCase()));
    }
    if(funcao) {
        resultado = resultado.filter(p => p.funcao.toLowerCase().includes(funcao.toLowerCase()));
    }
    if(nacionalidade) {
        resultado = resultado.filter(p => p.nacionalidade === nacionalidade);
    }
    if(ranking_hltv) {
        resultado = resultado.filter(p => p.ranking_hltv == ranking_hltv);
    }

    // Ordenação
    if(sort === "ranking_asc") {
        resultado.sort((a, b) => a.ranking_hltv - b.ranking_hltv);
    } else if(sort === "ranking_desc") {
        resultado.sort((a, b) => b.ranking_hltv - a.ranking_hltv);
    }

    return res.status(200).json({
        total: resultado.length,
        players: resultado
    });
};

const getByIdPlayers = (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: `O id deve ser válido`
        });
    }
    const player = players.find(p => p.id === id);
    if (!player){
        return res.status(404).json({
            success: false,
            message: `Este id: ${id}, não foi encontrado`
        });
    }
    return res.status(200).json({
        success: true,
        player: player
    });
};

const createPlayer = (req, res) => {
    const { nick, nome, time, funcao, nacionalidade, ranking_hltv } = req.body;
    if(!nome || !nick || !funcao || !nacionalidade){
        return res.status(400).json({
            success: false,
            message: `Nick, nome, função e nacionalidade do player são obrigatórios!`
        });
    }

    if (players.some(p => p.nick === nick)) {
        return res.status(409).json({ error: "Nick já registrado." });
    }

    const novoPlayer = {
        id: players.length + 1,
        nome,
        nick,
        time: time || "Sem time",
        funcao,
        nacionalidade,
        ranking_hltv: ranking_hltv || "Sem ranking"
    };

    players.push(novoPlayer);
    return res.status(201).json({
        success: true,
        message: `Nova promessa no cenário!`,
        player: novoPlayer
    });
};

const deletePlayer = (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: `O id deve ser válido`
        });
    }
    const playerRemove = players.find(p => p.id === id);
    if(!playerRemove){
        return res.status(404).json({
            success: false,
            message: `O player não existe`
        });
    }
    const playerFiltrado = players.filter(p => p.id !== id);
    players.splice(0, players.length, ...playerFiltrado);
    return res.status(200).json({
        success: true,
        message: `Player removido com sucesso!`
    });
};

const updatePlayer = (req, res) => {
    const id = parseInt(req.params.id);
    const { nick, nome, time, funcao, nacionalidade, ranking_hltv  } = req.body;

    if(isNaN(id)){
        return res.status(400).json({
            success: false,
            message: `O id deve ser válido`
        });
    }
    const playerExiste = players.find(p => p.id === id);
    if(!playerExiste){
        return res.status(404).json({
            success: false,
            message: `Esse id não foi encontrado: ${id}`,
        });
    }
    const playerAtualizado = players.map(player => player.id === id 
        ? {
            ...player,
            ...(nick && { nick }),
            ...(nome && { nome }),
            ...(time && { time }),
            ...(funcao && { funcao }),
            ...(nacionalidade && { nacionalidade }),
            ...(ranking_hltv && { ranking_hltv })
        }
        : player
    );

    players.splice(0, players.length, ...playerAtualizado);
    const playerEditado = players.find(p => p.id === id);

    return res.status(200).json({
        success: true,
        message: `Player editado com sucesso!`,
        player: playerEditado
    });
}

export { getAllPlayers, getByIdPlayers, createPlayer, deletePlayer, updatePlayer }