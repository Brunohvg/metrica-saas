# Funções de verificação de tipo de usuário

def is_gestor(user):
    return getattr(user, "type_user", None) == "GE"
    
def is_vendedor(user):
    """Verifica se o usuário é um vendedor."""
    return getattr(user, "type_user", None) == "VE"

def is_caixa(user):
    """Verifica se o usuário é um caixa."""
    return getattr(user, "type_user", None) == "CA"

def is_contabil(user):
    """Verifica se o usuário é um contador."""
    return getattr(user, "type_user", None) == "CT"