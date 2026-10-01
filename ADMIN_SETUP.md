# Painel administrativo BRASA 35

O painel está em `/admin/`.

## Estado atual
O painel já funciona em modo demonstração usando localStorage: cadastro, edição e exclusão de produtos; preços; categorias; disponibilidade individual; pausa da loja; e configurações.

Esse modo é proposital para a demo funcionar sem credenciais. Dados salvos no localStorage pertencem apenas ao navegador do administrador e **não alteram o cardápio de outros dispositivos**.

## Ativar sincronização real
1. Crie um projeto no Supabase.
2. Execute `supabase.sql` no SQL Editor.
3. Em Authentication, crie o usuário do proprietário.
4. Copie Project URL e anon/public key para `config.js`.
5. Conecte o adapter do painel ao Supabase. Nunca publique a service_role key no frontend.

## Segurança
O SQL habilita RLS: leitura pública do cardápio e escrita apenas para usuários autenticados. Antes de produção, restrinja as policies de escrita a uma tabela/claim específico de administradores se houver mais de um tipo de usuário autenticado.
