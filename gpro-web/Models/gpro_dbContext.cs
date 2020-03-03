
using Microsoft.EntityFrameworkCore;

namespace gpro_web.Models
{
    public partial class gpro_dbContext : DbContext
    {
        public gpro_dbContext()
        {
        }

        public gpro_dbContext(DbContextOptions<gpro_dbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<Empleado> Empleado { get; set; }
        public virtual DbSet<EmpleadoProyecto> EmpleadoProyecto { get; set; }
        public virtual DbSet<EscalaHoras> EscalaHoras { get; set; }
        public virtual DbSet<EscalaPerfiles> EscalaPerfiles { get; set; }
        public virtual DbSet<EstadoHoras> EstadoHoras { get; set; }
        public virtual DbSet<EstadoLiquidacion> EstadoLiquidacion { get; set; }
        public virtual DbSet<EstadoProyecto> EstadoProyecto { get; set; }
        public virtual DbSet<HoraTrabajada> HoraTrabajada { get; set; }
        public virtual DbSet<Liquidacion> Liquidacion { get; set; }
        public virtual DbSet<Modulo> Modulo { get; set; }
        public virtual DbSet<Operacion> Operacion { get; set; }
        public virtual DbSet<Perfil> Perfil { get; set; }
        public virtual DbSet<PerfilEmpleado> PerfilEmpleado { get; set; }
        public virtual DbSet<Proyecto> Proyecto { get; set; }
        public virtual DbSet<Rol> Rol { get; set; }
        public virtual DbSet<RolOperacion> RolOperacion { get; set; }
        public virtual DbSet<Tarea> Tarea { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }

        /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=tcp:servgpro.duckdns.org,49172; Database=gpro_db; User Id=gpro; Password=Pubdigitalix0;");
            }
        }
        */

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.IdCliente)
                    .IsRequired()
                    .HasColumnName("idCliente");

                entity.Property(e => e.ApellidoCliente)
                    .HasColumnName("apellidoCliente")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.DireccionCliente)
                    .IsRequired()
                    .HasColumnName("direccionCliente")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EmailCliente)
                    .IsRequired()
                    .HasColumnName("emailCliente")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NombreCliente)
                    .HasColumnName("nombreCliente")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.RazonSocialCliente)
                    .HasColumnName("razonSocialCliente")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TelefonoCliente)
                    .IsRequired()
                    .HasColumnName("telefonoCliente")
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Empleado>(entity =>
            {
                entity.HasKey(e => e.IdEmpleado);

                entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");

                entity.Property(e => e.ApellidoEmpleado)
                    .IsRequired()
                    .HasColumnName("apellidoEmpleado")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Domicilio)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.FechaIngreso)
                    .HasColumnName("fechaIngreso")
                    .HasColumnType("date");

                entity.Property(e => e.Localidad)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Nacionalidad)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.NombreEmpleado)
                    .IsRequired()
                    .HasColumnName("nombreEmpleado")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Provincia)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.Telefono)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<EmpleadoProyecto>(entity =>
            {
                entity.HasKey(e => new { e.IdEmpleado, e.IdProyecto });

                entity.HasOne(d => d.IdEmpleadoNavigation)
                    .WithMany(p => p.EmpleadoProyecto)
                    .HasForeignKey(d => d.IdEmpleado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EmpleadoProyecto_Empleado");

                entity.HasOne(d => d.IdProyectoNavigation)
                    .WithMany(p => p.EmpleadoProyecto)
                    .HasForeignKey(d => d.IdProyecto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EmpleadoProyecto_Proyecto");
            });

            modelBuilder.Entity<EstadoHoras>(entity =>
            {
                entity.HasKey(e => e.EstadoHoras1);

                entity.Property(e => e.EstadoHoras1)
                    .HasColumnName("EstadoHoras")
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<EstadoLiquidacion>(entity =>
            {
                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<EstadoProyecto>(entity =>
            {
                entity.HasKey(e => e.EstadoProyecto1);

                entity.Property(e => e.EstadoProyecto1)
                    .HasColumnName("EstadoProyecto")
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<HoraTrabajada>(entity =>
            {
                entity.HasKey(e => e.IdHoraTrabajada);

                entity.Property(e => e.IdHoraTrabajada).HasColumnName("idHoraTrabajada");

                entity.Property(e => e.CatidadHorasTrab).HasColumnName("catidadHorasTrab");

                entity.Property(e => e.EstadoHorasTrab)
                    .IsRequired()
                    .HasColumnName("estadoHorasTrab")
                    .HasMaxLength(9)
                    .IsUnicode(false);

                entity.Property(e => e.FechaHorasTrab)
                    .HasColumnName("fechaHorasTrab")
                    .HasColumnType("date");

                entity.Property(e => e.PerfilIdPerfil).HasColumnName("Perfil_idPerfil");

                entity.Property(e => e.ProyectoIdProyecto).HasColumnName("Proyecto_idProyecto");

                entity.Property(e => e.TareaIdTarea).HasColumnName("Tarea_idTarea");

                entity.HasOne(d => d.EstadoHorasTrabNavigation)
                    .WithMany(p => p.HoraTrabajada)
                    .HasForeignKey(d => d.EstadoHorasTrab)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HoraTrabajada_EstadoHoras");

                entity.HasOne(d => d.TareaIdTareaNavigation)
                    .WithMany(p => p.HoraTrabajada)
                    .HasForeignKey(d => d.TareaIdTarea)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HoraTrabajada_Tarea");

                entity.HasOne(d => d.PerfilEmpleado)
                    .WithMany(p => p.HoraTrabajada)
                    .HasForeignKey(d => new { d.PerfilIdPerfil, d.IdEmpleado, d.ProyectoIdProyecto })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_HoraTrabajada_PerfilEmpleado");
            });

            modelBuilder.Entity<Liquidacion>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.FechaDesde).HasColumnType("date");

                entity.Property(e => e.FechaHasta).HasColumnType("date");

                entity.HasOne(d => d.EstadoNavigation)
                    .WithMany(p => p.Liquidacion)
                    .HasForeignKey(d => d.Estado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Liquidacion_EstadoLiquidacion");

                entity.HasOne(d => d.IdEmpleadoNavigation)
                    .WithMany(p => p.Liquidacion)
                    .HasForeignKey(d => d.IdEmpleado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Liquidacion_Empleado");

                entity.HasOne(d => d.IdEscalaHorasNavigation)
                    .WithMany(p => p.Liquidacion)
                    .HasForeignKey(d => d.IdEscalaHoras)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Liquidacion_EscalaHoras");

                entity.HasOne(d => d.IdEscalaPerfilesNavigation)
                    .WithMany(p => p.Liquidacion)
                    .HasForeignKey(d => d.IdEscalaPerfiles)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Liquidacion_EscalaPerfiles");
            });

            modelBuilder.Entity<Modulo>(entity =>
            {
                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Operacion>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.Operacion)
                    .HasForeignKey<Operacion>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Oper_Modulo");
            });

            modelBuilder.Entity<Perfil>(entity =>
            {
                entity.HasKey(e => e.IdPerfil);

                entity.Property(e => e.IdPerfil).HasColumnName("idPerfil");

                entity.Property(e => e.DescripcionPerfil)
                    .IsRequired()
                    .HasColumnName("descripcionPerfil")
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<PerfilEmpleado>(entity =>
            {
                entity.HasKey(e => new { e.PerfilEmpleadoIdPerfil, e.PerfilEmpleadoIdEmpleado, e.ProyectoIdProyecto });

                entity.Property(e => e.PerfilEmpleadoIdPerfil).HasColumnName("PerfilEmpleado_idPerfil");

                entity.Property(e => e.PerfilEmpleadoIdEmpleado).HasColumnName("PerfilEmpleado_idEmpleado");

                entity.Property(e => e.ProyectoIdProyecto).HasColumnName("Proyecto_IdProyecto");

                entity.HasOne(d => d.PerfilEmpleadoIdEmpleadoNavigation)
                    .WithMany(p => p.PerfilEmpleado)
                    .HasForeignKey(d => d.PerfilEmpleadoIdEmpleado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_idEmpleadp");

                entity.HasOne(d => d.PerfilEmpleadoIdPerfilNavigation)
                    .WithMany(p => p.PerfilEmpleado)
                    .HasForeignKey(d => d.PerfilEmpleadoIdPerfil)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PerfilEmpleado_Perfil");
            });

            modelBuilder.Entity<Proyecto>(entity =>
            {
                                entity.HasKey(e => e.IdProyecto);

                entity.Property(e => e.IdProyecto).HasColumnName("idProyecto");

                entity.Property(e => e.ClienteId).HasColumnName("cliente_id");

                entity.Property(e => e.DescripcionProyecto)
                    .IsRequired()
                    .HasColumnName("descripcionProyecto")
                    .HasMaxLength(40)
                    .IsUnicode(false);

                entity.Property(e => e.EstadoProyecto)
                    .IsRequired()
                    .HasColumnName("estadoProyecto")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.IdEmpleadoPm).HasColumnName("id_Empleado_PM");

                entity.Property(e => e.TituloProyecto)
                    .IsRequired()
                    .HasColumnName("tituloProyecto")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.ClienteIdNavigation)
                    .WithMany(p => p.Proyecto)
                    .HasForeignKey(d => d.ClienteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Proyecto_Cliente");

                entity.HasOne(d => d.EstadoProyectoNavigation)
                    .WithMany(p => p.Proyecto)
                    .HasForeignKey(d => d.EstadoProyecto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Proyecto_EstadoProyecto");

                entity.HasOne(d => d.IdEmpleadoPmNavigation)
                    .WithMany(p => p.Proyecto)
                    .HasForeignKey(d => d.IdEmpleadoPm)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Proyecto_Empleado");            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Rol1)
                    .IsRequired()
                    .HasColumnName("Rol")
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<RolOperacion>(entity =>
            {
                entity.HasOne(d => d.IdOperacionNavigation)
                    .WithMany(p => p.RolOperacion)
                    .HasForeignKey(d => d.IdOperacion)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RolOp_Operacion");

                entity.HasOne(d => d.IdRolNavigation)
                    .WithMany(p => p.RolOperacion)
                    .HasForeignKey(d => d.IdRol)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RolOp_Rol");
            });

            modelBuilder.Entity<Tarea>(entity =>
            {
                entity.HasKey(e => e.IdTarea);

                entity.Property(e => e.IdTarea)
                    .HasColumnName("idTarea");

                entity.Property(e => e.DescripcionTarea)
                    .IsRequired()
                    .HasColumnName("descripcionTarea")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.HorasEstimadasTarea).HasColumnName("horasEstimadasTarea");

                entity.Property(e => e.HorasOverbudgetTarea).HasColumnName("horasOverbudgetTarea");

                entity.Property(e => e.PerfilEmpleadoIdEmpleado).HasColumnName("PerfilEmpleado_idEmpleado");

                entity.Property(e => e.PerfilEmpleadoIdPerfil).HasColumnName("PerfilEmpleado_idPerfil");

                entity.Property(e => e.ProyectoIdProyecto).HasColumnName("Proyecto_idProyecto");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.Property(e => e.PasswordSalt)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdEmpleadoNavigation)
                    .WithMany(p => p.Usuario)
                    .HasForeignKey(d => d.IdEmpleado)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Usuario_Empleado");

                entity.HasOne(d => d.IdRolNavigation)
                    .WithMany(p => p.Usuario)
                    .HasForeignKey(d => d.IdRol)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Usuario_Rol");
            });
        }
    }
}
