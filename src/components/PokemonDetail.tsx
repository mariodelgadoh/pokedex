import React, { useEffect } from 'react';
import { Pokemon } from '../types/pokemon.types';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

// Traducción de tipos al español
const typeTranslations: { [key: string]: string } = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada'
};

// Traducción de habilidades al español
const abilityTranslations: { [key: string]: string } = {
  // Habilidades comunes
  overgrow: 'Espesura',
  blaze: 'Mar Llamas',
  torrent: 'Torrente',
  shielddust: 'Polvo Escudo',
  shedskin: 'Mudar',
  compoundeyes: 'Ojo Compuesto',
  swarm: 'Enjambre',
  sniper: 'Francotirador',
  keeneye: 'Vista Lince',
  tangledfeet: 'Tumbos',
  guts: 'Agallas',
  intimidate: 'Intimidación',
  static: 'Elec. Estática',
  lightningrod: 'Pararrayos',
  sandveil: 'Velo Arena',
  poisonpoint: 'Punto Tóxico',
  rivalry: 'Rivalidad',
  sheerforce: 'Potencia Bruta',
  poisonheal: 'Antídoto',
  quickfeet: 'Pies Rápidos',
  pressure: 'Presión',
  thickfat: 'Sebo',
  earlybird: 'Madrugar',
  flamebody: 'Cuerpo Llama',
  runaway: 'Fuga',
  pickup: 'Recogida',
  technician: 'Experto',
  plus: 'Más',
  minus: 'Menos',
  forecast: 'Predicción',
  stickyhold: 'Viscosidad',
  naturalcure: 'Cura Natural',
  oblivious: 'Despiste',
  ownpace: 'Ritmo Propio',
  suctioncups: 'Ventosas',
  truant: 'Perezoso',
  hustle: 'Entusiasmo',
  cutecharm: 'Gran Encanto',
  magicguard: 'Muro Mágico',
  hydration: 'Hidratación',
  dryskin: 'Piel Seca',
  wonderguard: 'Superguarda',
  flowergift: 'Don Floral',
  battlearmor: 'Armadura Batalla',
  strongjaw: 'Mandíbula Fuerte',
  furcoat: 'Pelaje Recio',
  bulletproof: 'Antibalas',
  competitive: 'Competitivo',
  beastboost: 'Ultraimpulso',
  
  // Habilidades específicas de Kanto
  chlorophyll: 'Clorofila',
  solarpower: 'Poder Solar',
  raindish: 'Cura Lluvia',
  drought: 'Sequía',
  drizzle: 'Llovizna',
  speedboost: 'Impulso',
  battlerush: 'Batería Asalto',
  megalauncher: 'Megacañón',
  toughclaws: 'Garra Dura',
  aerilate: 'Piel Celeste',
  refrigerate: 'Piel Helada',
  strongfeet: 'Pies Firmes',
  sandrush: 'Ímpetu Arena',
  analytic: 'Cálculo Final',
  illusion: 'Ilusión',
  infiltrator: 'Allanamiento',
  mummy: 'Momia',
  cursedbody: 'Cuerpo Maldito',
  waterabsorb: 'Absorbe Agua',
  flashfire: 'Combustible',
  levitate: 'Levitación',
  voltabsorb: 'Absorbe Elec',
  motordrive: 'Electromotor',
  rattled: 'Pavor',
  justified: 'Justiciero',
  reckless: 'Audaz',
  rockhead: 'Cabeza Roca',
  sturdy: 'Robustez',
  unburden: 'Liviano',
  defiant: 'Competitivo',
  innerfocus: 'Foco Interno',
  steadfast: 'Impasible',
  moody: 'Veleta',
  multiscale: 'Escama Mult.',
  overcoat: 'Funda',
  anticipation: 'Anticipación',
  forewarn: 'Alerta',
  insomnia: 'Insomnio',
  vitalspirit: 'Espíritu Vital',
  limber: 'Flexibilidad',
  leafguard: 'Defensa Hoja',
  flowerveil: 'Velo Flor',
  aromaveil: 'Velo Aroma',
  sweetveil: 'Velo Dulce',
  healer: 'Alma Cura',
  regenerator: 'Regeneración'
};

// Traducir el tipo al español
const translateType = (type: string): string => {
  return typeTranslations[type] || type;
};

// Traducir la habilidad al español
const translateAbility = (ability: string): string => {
  // Limpiar el nombre de la habilidad (quitar guiones)
  const cleanAbility = ability.toLowerCase().replace(/-/g, '');
  return abilityTranslations[cleanAbility] || ability.replace(/-/g, ' ');
};

// Descripciones de Pokémon (simuladas - idealmente vendrían de la API)
const getPokemonDescription = (pokemon: Pokemon): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Bulbasaur. Puede verse descansando en claros del bosque. Las semillas que tiene en el lomo absorben nutrientes y energía solar.',
    2: 'Ivysaur. Cuando el bulbo de su lomo florece, desprende un aroma dulce y comienza a buscar luz solar.',
    3: 'Venusaur. Su flor absorbe rayos solares para convertirlos en energía. Desprende un aroma embriagador.',
    4: 'Charmander. La llama de su cola indica su estado de ánimo. Si está saludable, la llama arde intensamente.',
    5: 'Charmeleon. Si se enfada, su cola se vuelve de un color rojo intenso y ataca sin piedad.',
    6: 'Charizard. Sus alas pueden alcanzar una altura de 1400 metros. Escupe fuego capaz de derretir rocas.',
    7: 'Squirtle. Cuando retrae su largo cuello en el caparazón, dispara agua a una presión increíble.',
    8: 'Wartortle. Se considera un símbolo de longevidad. Los mayores tienen musgo en el caparazón.',
    9: 'Blastoise. Los cañones de agua que tiene en el caparazón pueden disparar proyectiles con puntería.',
    25: 'Pikachu. Cuando se enfada, descarga la energía acumulada en sus mejillas y libera poderosos rayos.'
  };
  
  return descriptions[pokemon.id] || `${pokemon.name} es un Pokémon de tipo ${pokemon.types.map(t => translateType(t.type.name)).join(' y ')}. Se caracteriza por sus habilidades únicas y su comportamiento en la naturaleza.`;
};

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  // Disparar evento cuando se abre el modal
  useEffect(() => {
    window.dispatchEvent(new Event('pokemonModalOpen'));
    
    return () => {
      window.dispatchEvent(new Event('pokemonModalClose'));
    };
  }, []);

  // Obtener el color principal basado en el tipo del Pokémon
  const getPokemonColor = (): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const colors: { [key: string]: { bg: string, bgLight: string, text: string } } = {
      normal: { bg: 'bg-gray-500', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      fire: { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700' },
      water: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700' },
      electric: { bg: 'bg-yellow-400', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      grass: { bg: 'bg-green-500', bgLight: 'bg-green-50', text: 'text-green-700' },
      ice: { bg: 'bg-cyan-400', bgLight: 'bg-cyan-50', text: 'text-cyan-700' },
      fighting: { bg: 'bg-red-700', bgLight: 'bg-red-50', text: 'text-red-700' },
      poison: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700' },
      ground: { bg: 'bg-yellow-700', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      flying: { bg: 'bg-indigo-400', bgLight: 'bg-indigo-50', text: 'text-indigo-700' },
      psychic: { bg: 'bg-pink-500', bgLight: 'bg-pink-50', text: 'text-pink-700' },
      bug: { bg: 'bg-lime-500', bgLight: 'bg-lime-50', text: 'text-lime-700' },
      rock: { bg: 'bg-yellow-600', bgLight: 'bg-yellow-50', text: 'text-yellow-700' },
      ghost: { bg: 'bg-purple-700', bgLight: 'bg-purple-50', text: 'text-purple-700' },
      dragon: { bg: 'bg-indigo-600', bgLight: 'bg-indigo-50', text: 'text-indigo-700' },
      dark: { bg: 'bg-gray-700', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      steel: { bg: 'bg-gray-400', bgLight: 'bg-gray-50', text: 'text-gray-700' },
      fairy: { bg: 'bg-pink-400', bgLight: 'bg-pink-50', text: 'text-pink-700' }
    };

    return colors[mainType]?.bgLight || 'bg-gray-50';
  };

  const getPokemonHeaderColor = (): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const colors: { [key: string]: string } = {
      normal: 'bg-gradient-to-r from-gray-500 to-gray-600',
      fire: 'bg-gradient-to-r from-orange-500 to-red-500',
      water: 'bg-gradient-to-r from-blue-500 to-blue-600',
      electric: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      grass: 'bg-gradient-to-r from-green-500 to-green-600',
      ice: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      fighting: 'bg-gradient-to-r from-red-700 to-red-800',
      poison: 'bg-gradient-to-r from-purple-500 to-purple-600',
      ground: 'bg-gradient-to-r from-yellow-700 to-yellow-800',
      flying: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
      psychic: 'bg-gradient-to-r from-pink-500 to-pink-600',
      bug: 'bg-gradient-to-r from-lime-500 to-lime-600',
      rock: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
      ghost: 'bg-gradient-to-r from-purple-700 to-purple-800',
      dragon: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      dark: 'bg-gradient-to-r from-gray-700 to-gray-800',
      steel: 'bg-gradient-to-r from-gray-400 to-gray-500',
      fairy: 'bg-gradient-to-r from-pink-400 to-pink-500'
    };

    return colors[mainType] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-500',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-400'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeTextColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'text-gray-800',
      fire: 'text-white',
      water: 'text-white',
      electric: 'text-gray-800',
      grass: 'text-white',
      ice: 'text-gray-800',
      fighting: 'text-white',
      poison: 'text-white',
      ground: 'text-gray-800',
      flying: 'text-white',
      psychic: 'text-white',
      bug: 'text-white',
      rock: 'text-gray-800',
      ghost: 'text-white',
      dragon: 'text-white',
      dark: 'text-white',
      steel: 'text-gray-800',
      fairy: 'text-gray-800'
    };
    return colors[type] || 'text-white';
  };

  const pokemonImage = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default;

  // Estadísticas principales para mostrar
  const mainStats = {
    hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    spAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    spDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0
  };

  // Calcular color de barra según el valor y el tipo
  const getStatBarColor = (value: number, statName: string): string => {
    const mainType = pokemon.types[0]?.type.name || 'normal';
    
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-500',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-400'
    };

    return typeColors[mainType] || 'bg-blue-500';
  };

  const backgroundColor = getPokemonColor();
  const headerColor = getPokemonHeaderColor();
  const description = getPokemonDescription(pokemon);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div className={`${backgroundColor} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-200`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header con degradado del tipo */}
        <div className={`${headerColor} px-4 sm:px-8 py-4 sm:py-6 rounded-t-2xl`}>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
            <div className="text-center sm:text-left">
              <span className="text-white/80 text-xs sm:text-sm font-mono block sm:inline">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white capitalize">
                {pokemon.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl sm:text-3xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all absolute top-2 right-2 sm:relative sm:top-0 sm:right-0"
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-8">
          {/* Imagen y tipos */}
          <div className="flex flex-col items-center md:flex-row md:items-start gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl p-3 sm:p-4 flex items-center justify-center border-4 border-white shadow-xl">
              <img 
                src={pokemonImage} 
                alt={pokemon.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3 sm:mb-4">
                {pokemon.types.map((typeInfo) => (
                  <span
                    key={typeInfo.type.name}
                    className={`${getTypeColor(typeInfo.type.name)} ${getTypeTextColor(typeInfo.type.name)} px-3 py-1.5 sm:px-4 sm:py-2 rounded-full capitalize font-medium shadow-md text-xs sm:text-sm tracking-wide`}
                  >
                    {translateType(typeInfo.type.name)}
                  </span>
                ))}
              </div>
              
              {/* Descripción del Pokémon */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm mb-4">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjetas de información en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Información Básica */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 border-2 border-blue-300 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-3 sm:mb-4 pb-2 border-b-2 border-blue-300 text-center md:text-left">
                 Información Básica
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/70 rounded-lg p-2 shadow-sm">
                  <span className="text-blue-700 font-medium text-sm sm:text-base">Altura</span>
                  <span className="text-blue-900 font-bold text-sm sm:text-base">{pokemon.height / 10} m</span>
                </div>
                <div className="flex justify-between items-center md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/70 rounded-lg p-2 shadow-sm">
                  <span className="text-blue-700 font-medium text-sm sm:text-base">Peso</span>
                  <span className="text-blue-900 font-bold text-sm sm:text-base">{pokemon.weight / 10} kg</span>
                </div>
              </div>
            </div>

            {/* Habilidades - CON HABILIDADES OCULTAS DESTACADAS */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5 border-2 border-purple-300 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-purple-800 mb-3 sm:mb-4 pb-2 border-b-2 border-purple-300 text-center md:text-left">
                 Habilidades
              </h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {pokemon.abilities.map((abilityInfo) => (
                  <span
                    key={abilityInfo.ability.name}
                    className={`
                      ${abilityInfo.is_hidden 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500' 
                        : 'bg-white/80 text-purple-800 border-purple-300'
                      } 
                      px-3 py-1.5 sm:px-4 sm:py-2 rounded-full capitalize text-xs sm:text-sm font-semibold border shadow-sm hover:shadow-md transition-all flex items-center gap-1
                    `}
                  >
                    {translateAbility(abilityInfo.ability.name)}
                    {abilityInfo.is_hidden && (
                      <span className="ml-1.5 text-[10px] bg-white/30 text-white px-1.5 py-0.5 rounded-full font-normal">
                        Oculta
                      </span>
                    )}
                  </span>
                ))}
              </div>
              
              {/* Explicación de habilidades ocultas */}
              <div className="mt-3 text-xs text-purple-600 bg-white/50 rounded-lg p-2 text-center md:text-left">
                <span className="font-semibold"> Habilidad Oculta:</span> Especial y más rara de conseguir
              </div>
            </div>
          </div>

          {/* Estadísticas Base */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5 border-2 border-green-300 shadow-md">
            <h3 className="text-base sm:text-lg font-bold text-green-800 mb-4 sm:mb-5 pb-2 border-b-2 border-green-300 text-center md:text-left">
               Estadísticas Base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">HP</span>
                    <span className="text-green-900 font-bold">{mainStats.hp}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.hp, 'hp')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.hp / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">Ataque</span>
                    <span className="text-green-900 font-bold">{mainStats.attack}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.attack, 'attack')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.attack / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">Defensa</span>
                    <span className="text-green-900 font-bold">{mainStats.defense}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.defense, 'defense')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.defense / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">Ataque Esp.</span>
                    <span className="text-green-900 font-bold">{mainStats.spAttack}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.spAttack, 'spAttack')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.spAttack / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">Defensa Esp.</span>
                    <span className="text-green-900 font-bold">{mainStats.spDefense}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.spDefense, 'spDefense')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.spDefense / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 md:justify-between max-w-xs mx-auto md:mx-0 md:max-w-none bg-white/60 rounded-lg p-2">
                    <span className="text-green-700 font-semibold">Velocidad</span>
                    <span className="text-green-900 font-bold">{mainStats.speed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div 
                      className={`${getStatBarColor(mainStats.speed, 'speed')} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${(mainStats.speed / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};