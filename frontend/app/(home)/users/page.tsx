

export default function UsersPage() {
    const users = [
        { name: 'Elena Vance', email: 'evance@ceyntics.io', role: 'Admin', status: 'Online', dept: 'Global Operations' },

    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">User Management</h2>
                    <p className="text-on-surface-variant">Configure system access levels.</p>
                </div>
                <button className="bg-sky-400 text-slate-950 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined">person_add</span>
                    Create New User
                </button>
            </div>



            <div className="bg-surface-container border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-highest/20 text-slate-500 uppercase text-[10px] tracking-widest">
                            <th className="px-6 py-4 border-b border-slate-800">User Identity</th>
                            <th className="px-6 py-4 border-b border-slate-800">Role Authority</th>
                            <th className="px-6 py-4 border-b border-slate-800">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map((user) => (
                            <tr key={user.email} className="hover:bg-surface-container-high transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-label-md">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 text-[10px] font-bold border border-sky-500/20">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-emerald-500">{user.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}