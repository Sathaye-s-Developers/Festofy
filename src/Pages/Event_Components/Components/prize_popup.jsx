import React from 'react'

const prize_popup = () => {
    return (
        <div>
            <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Prizes & Rewards</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                    {subEvent.prizes.map((prize, prizeIndex) => (
                        <div key={prizeIndex} className="flex items-center space-x-3 p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {prizeIndex + 1}
                            </div>
                            <span className="text-yellow-400 text-sm font-medium">{prize.replace(/\$/g, '')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default prize_popup
