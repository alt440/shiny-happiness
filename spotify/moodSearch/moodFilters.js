function getAdventurousFilter(){
  //use the popularity index to help. Search for low/medium popularity
  return {
    filter: 'adventurous',
    danceability: 0,
    danceabilitySign: '+',
    valency: 0,
    valencySign: '+',
    energy: 0,
    energySign: '+',
    tempo: 0, //in bpm
    tempoSign: '+',
    popularity: 0.5,
    popularitySign: '-'
  };
}

function getCalmFilter(){
  //use the tempo feature to extract bpm. Look for bpm under a certain value.
  return {
    filter: 'calm',
    danceability: 0.5,
    danceabilitySign: '-',
    valency: 0,
    valencySign: '+',
    energy: 0.5,
    energySign: '-',
    tempo: 80, //in bpm
    tempoSign: '-',
    popularity: 0,
    popularitySign: '+'
  };
}

function getFestiveFilter(){
  //search for musics with a high energy (>0.7), high danceability (>0.7),
  //which also have a valence above 0.5 (valence indicate positiveness)
  return {
    filter: 'festive',
    danceability: 0.5,
    danceabilitySign: '+',
    valency: 0.5,
    valencySign: '+',
    energy: 0,
    energySign: '+',
    tempo: 90, //in bpm
    tempoSign: '+',
    popularity: 0,
    popularitySign: '+'
  };
}

function getHappyFilter(){
  //search for musics with a very high valence (0.8) and high BPM (>80).
  return {
    filter: 'happy',
    danceability: 0,
    danceabilitySign: '+',
    valency: 0.5,
    valencySign: '+',
    energy: 0,
    energySign: '+',
    tempo: 70, //in bpm
    tempoSign: '+',
    popularity: 0,
    popularitySign: '+'
  };
}

module.exports = {getHappyFilter, getFestiveFilter, getCalmFilter, getAdventurousFilter};
