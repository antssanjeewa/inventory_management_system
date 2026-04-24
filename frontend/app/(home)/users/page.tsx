"use client";

import { useEffect, useState } from 'react';
import { getUsers, deleteUser, User } from "@/services/userService";
import { showError, confirmAction, showSuccess } from '@/lib/alert';
import { TableLoading } from '@/components/TableLoading';
import { TableEmpty } from '@/components/TableEmpty';
import UserForm from './components/UserForm';
import PageButton from '@/components/PageButton';
import Breadcrumb from '@/components/Breadcrumb';

export default function UsersPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await getUsers(page);

      setUsers(res.users);
      setMeta(res.meta);
    } catch (error: any) {
      showError(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (meta && page > meta.last_page)) return;
    loadUsers(page);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirmAction("Delete User?", "This user account will be permanently removed.");
    if (!isConfirmed) return;

    try {
      await deleteUser(id);
      showSuccess("User deleted successfully");
      loadUsers();

    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <Breadcrumb
            pageTitle="User Management"
            items={[
              { label: "Users", active: true }
            ]}
          />
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-sky-400 text-slate-950 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-sky-300 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">person_add</span>
            Create New User
          </button>
        </div>

        <div className="bg-surface-container border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/20 text-slate-500 uppercase text-[10px] tracking-widest">
                <th className="px-6 py-4 border-b border-slate-800">User Name</th>
                <th className="px-6 py-4 border-b border-slate-800">Email Address</th>
                <th className="px-6 py-4 border-b border-slate-800">Role Authority</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && <TableLoading colSpan={4} />}
              {!loading && users.length === 0 && <TableEmpty colSpan={4} />}
              {!loading &&
                users.map((user) => (
                  <tr key={user.email} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-3">
                      <div>{user.name}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div>{user.email}</div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-on-surface hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(user.id)}
                          className="p-2 text-on-surface hover:text-tertiary hover:bg-tertiary/10 rounded-lg transition-all">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>


          <div className="p-lg border-t border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
            <p className="text-xs text-outline">
              Showing <span className="font-bold text-on-surface">
                {meta ? Math.min(meta.per_page * meta.current_page, meta.total) : 0}
              </span> of {meta?.total || 0} items
            </p>
            <div className="flex gap-1.5 items-center">
              <PageButton
                icon="chevron_left"
                disabled={!meta || meta.current_page === 1}
                onClick={() => handlePageChange(meta.current_page - 1)}
              />
              {meta && [...Array(meta.last_page)].map((_, i) => (
                <PageButton
                  key={i + 1}
                  label={i + 1}
                  active={meta.current_page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                />
              ))}
              <PageButton
                icon="chevron_right"
                disabled={!meta || meta.current_page === meta.last_page}
                onClick={() => handlePageChange(meta.current_page + 1)}
              />
            </div>
          </div>
        </div>
      </div>

      <UserForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadUsers}
        initialData={selectedUser}
      />
    </>
  );
}
