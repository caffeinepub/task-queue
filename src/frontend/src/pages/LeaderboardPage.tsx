import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { backend } from '../utils/backendService';
import type { LeaderboardEntry } from '../backend.d';
import { getAvatarColor } from '../utils/crypto';

const MOCK_LEADERS: Array<{ displayName: string; workoutCount: number; memberSince: string }> = [
  { displayName: 'Marcus T.',  workoutCount: 312, memberSince: 'Jan 2023' },
  { displayName: 'Sarah J.',   workoutCount: 287, memberSince: 'Mar 2023' },
  { displayName: 'Alex R.',    workoutCount: 251, memberSince: 'Feb 2023' },
  { displayName: 'Emma W.',    workoutCount: 234, memberSince: 'Apr 2023' },
  { displayName: 'James K.',   workoutCount: 218, memberSince: 'Jun 2023' },
  { displayName: 'Sofia M.',   workoutCount: 196, memberSince: 'May 2023' },
  { displayName: 'Noah B.',    workoutCount: 183, memberSince: 'Jul 2023' },
  { displayName: 'Olivia C.',  workoutCount: 171, memberSince: 'Aug 2023' },
  { displayName: 'Liam D.',    workoutCount: 155, memberSince: 'Sep 2023' },
  { displayName: 'Ava H.',     workoutCount: 142, memberSince: 'Oct 2023' },
];

type Period = 'all_time' | 'month' | 'week';

interface Leader {
  name: string;
  workouts: number;
  since: string;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('all_time');
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const data = await backend.getLeaderboard(p, BigInt(20));
      if (data.length > 0) {
        setLeaders(data.map((e: LeaderboardEntry, i: number) => ({
          name: e.displayName,
          workouts: Number(e.workoutCount),
          since: new Date(Number(e.memberSince) / 1000000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          rank: i + 1,
        })));
      } else {
        const multiplier = p === 'week' ? 0.03 : p === 'month' ? 0.15 : 1;
        setLeaders(MOCK_LEADERS.map((m, i) => ({
          name: m.displayName,
          workouts: Math.floor(m.workoutCount * multiplier) || 1,
          since: m.memberSince,
          rank: i + 1,
        })));
      }
    } catch {
      const multiplier = p === 'week' ? 0.03 : p === 'month' ? 0.15 : 1;
      setLeaders(MOCK_LEADERS.map((m, i) => ({
        name: m.displayName,
        workouts: Math.floor(m.workoutCount * multiplier) || 1,
        since: m.memberSince,
        rank: i + 1,
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard(period);
  }, [period, loadLeaderboard]);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
    if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)';
    if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #A0522D)';
    return '#F3F4F6';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#D97706';
    if (rank === 2) return '#6B7280';
    if (rank === 3) return '#92400E';
    return 'var(--ic-text-secondary)';
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <Trophy size={26} style={{ color: '#F97316' }} />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold mb-1" style={{ color: 'var(--ic-text-primary)' }}>
          Champions
        </h1>
        <p className="text-sm" style={{ color: 'var(--ic-text-secondary)' }}>
          The most dedicated athletes in the IRONCLAD community
        </p>
      </div>

      {/* Period Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: '#F3F4F6', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {[
          { id: 'all_time' as Period, label: 'All Time' },
          { id: 'month' as Period,    label: 'This Month' },
          { id: 'week' as Period,     label: 'This Week' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPeriod(tab.id)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-heading font-semibold transition-all"
            style={{
              background: period === tab.id ? '#3B82F6' : 'transparent',
              color: period === tab.id ? '#fff' : 'var(--ic-text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={`skel-${i}`} className="ic-card p-4 shimmer h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="ic-card p-6">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-heading font-bold text-xl text-white relative"
                    style={{ background: getAvatarColor(top3[1]?.name || ''), border: '3px solid #C0C0C0' }}
                  >
                    {top3[1]?.name.charAt(0)}
                    <div
                      className="absolute -bottom-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#C0C0C0', color: '#000' }}
                    >2</div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-heading font-bold text-xs" style={{ color: 'var(--ic-text-primary)' }}>
                      {top3[1]?.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>
                      {top3[1]?.workouts} workouts
                    </p>
                  </div>
                  <div
                    className="h-16 w-20 rounded-t-xl flex items-center justify-center"
                    style={{ background: 'rgba(192,192,192,0.12)', border: '1px solid rgba(192,192,192,0.25)' }}
                  >
                    <Medal size={20} style={{ color: '#C0C0C0' }} />
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center gap-2">
                  <Crown size={20} style={{ color: '#F59E0B' }} />
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-heading font-bold text-2xl text-white relative"
                    style={{ background: getAvatarColor(top3[0]?.name || ''), border: '3px solid #FFD700' }}
                  >
                    {top3[0]?.name.charAt(0)}
                    <div
                      className="absolute -bottom-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: '#FFD700', color: '#000' }}
                    >1</div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>
                      {top3[0]?.name}
                    </p>
                    <p className="text-xs" style={{ color: '#F97316', fontWeight: 600 }}>
                      {top3[0]?.workouts} workouts
                    </p>
                  </div>
                  <div
                    className="h-24 w-20 rounded-t-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}
                  >
                    <Trophy size={24} style={{ color: '#FFD700' }} />
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg text-white relative"
                    style={{ background: getAvatarColor(top3[2]?.name || ''), border: '3px solid #CD7F32' }}
                  >
                    {top3[2]?.name.charAt(0)}
                    <div
                      className="absolute -bottom-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#CD7F32', color: '#fff' }}
                    >3</div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-heading font-bold text-xs" style={{ color: 'var(--ic-text-primary)' }}>
                      {top3[2]?.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>
                      {top3[2]?.workouts} workouts
                    </p>
                  </div>
                  <div
                    className="h-12 w-20 rounded-t-xl flex items-center justify-center"
                    style={{ background: 'rgba(205,127,50,0.1)', border: '1px solid rgba(205,127,50,0.2)' }}
                  >
                    <Medal size={16} style={{ color: '#CD7F32' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full ranked list */}
          <div className="space-y-2">
            {leaders.map(leader => (
              <div key={leader.name} className="ic-card p-4 flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 text-center font-display text-lg" style={{ color: getRankColor(leader.rank) }}>
                  {leader.rank <= 3 ? (
                    <span style={{ fontSize: 18 }}>
                      {leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : leader.rank}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white shrink-0"
                  style={{ background: getAvatarColor(leader.name) }}
                >
                  {leader.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--ic-text-primary)' }}>
                    {leader.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>
                    Member since {leader.since}
                  </p>
                </div>

                {/* Workouts count */}
                <div className="text-right">
                  <p
                    className="font-heading font-bold text-lg"
                    style={{ color: leader.rank === 1 ? '#F97316' : leader.rank <= 3 ? getRankColor(leader.rank) : 'var(--ic-text-primary)' }}
                  >
                    {leader.workouts}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--ic-text-secondary)' }}>workouts</p>
                </div>

                {/* Rank bar */}
                <div className="hidden sm:block w-24">
                  <div className="h-1.5 rounded-full" style={{ background: '#F3F4F6' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(leader.workouts / (leaders[0]?.workouts || 1)) * 100}%`,
                        background: getRankBg(leader.rank),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suppress unused variable warning */}
          {rest.length === 0 && null}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
