import bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");

    // hash da senha ANTES de persistir
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = User.restore({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      teacherId: dto.teacherId,
      permissions: dto.permissions as string[],
    })!;

    await this.userRepository.create(user);
  }

  // chamado pelo AuthService durante o login
  async validateCredentials(email: string, password: string): Promise<UserPayload | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    // retorna apenas o que entra no JWT — sem a senha
    return { id: user.id!, email: user.email, permissions: user.permissions };
  }
}