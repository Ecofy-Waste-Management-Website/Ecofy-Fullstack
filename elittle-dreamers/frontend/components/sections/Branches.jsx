'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Branches() {
  const [branches, setBranches] = useState([])

  useEffect(() => {
    async function fetchBranches() {
      const { data } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
      if (data) setBranches(data)
    }
    fetchBranches()
  }, [])

  return (
    <section className="bg-sky-blue px-8 py-10">
      <h2 className="text-4xl font-extrabold text-navy text-center mb-8">
        OUR BRANCHES
      </h2>

      <div className="flex flex-col gap-4">
        {branches.length === 0 ? (
          // Skeleton placeholders
          <>
            <div className="img-slot w-full rounded-2xl animate-pulse" data-label="[ LOADING... ]" style={{ height: '200px' }} />
            <div className="img-slot w-full rounded-2xl animate-pulse" data-label="[ LOADING... ]" style={{ height: '200px' }} />
          </>
        ) : (
          branches.map((branch) => (
            <div key={branch.id}>
              {/* IMAGE SLOT: Replace with <Image> when branch photo is ready */}
              <div className="img-slot w-full rounded-2xl" data-label="[ BRANCH IMAGE ]" style={{ height: '200px' }} />
              
              <div className="mt-3 px-1">
                <p className="font-bold text-sm text-navy">{branch.name}</p>
                <p className="text-xs text-navy/70 mt-0.5">{branch.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-navy">⭐ {branch.rating}</span>
                </div>
                <a href={branch.map_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-teal hover:underline mt-1 inline-block">
                  Track Location →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
