import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";

export class ListSalons {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute() {
    return this.salonRepository.list();
  }
}
